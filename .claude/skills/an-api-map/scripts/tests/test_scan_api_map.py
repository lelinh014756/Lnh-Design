"""Unit tests for scan_api_map.py — run with stdlib unittest (no pytest dep)."""

from __future__ import annotations

import importlib.util
import sys
import tempfile
import unittest
from pathlib import Path

SCRIPT_PATH = Path(__file__).resolve().parent.parent / "scan_api_map.py"
spec = importlib.util.spec_from_file_location("scan_api_map", SCRIPT_PATH)
scan = importlib.util.module_from_spec(spec)
spec.loader.exec_module(scan)


class DetectCacheTierTest(unittest.TestCase):
    def test_lookup_tier(self):
        self.assertEqual(scan.detect_cache_tier("...CACHE_DURATIONS.LOOKUP"), "LOOKUP")
        self.assertEqual(scan.detect_cache_tier("...lookupQueryDefaults"), "LOOKUP")

    def test_user_data_tier(self):
        self.assertEqual(scan.detect_cache_tier("CACHE_DURATIONS.USER_DATA"), "USER_DATA")
        self.assertEqual(scan.detect_cache_tier("staleTime: 1000 * 60 * 5"), "USER_DATA")

    def test_dashboard_tier(self):
        self.assertEqual(scan.detect_cache_tier("CACHE_DURATIONS.DASHBOARD"), "DASHBOARD")

    def test_list_query_defaults(self):
        self.assertEqual(scan.detect_cache_tier("...LIST_QUERY_DEFAULTS"), "LIST_QUERY_DEFAULTS")

    def test_default_fallback(self):
        self.assertEqual(scan.detect_cache_tier("staleTime: 1000 * 30"), "default")
        self.assertEqual(scan.detect_cache_tier(""), "default")


class DetectLazyFlagTest(unittest.TestCase):
    def test_lazy_with_condition(self):
        self.assertIn("id != null", scan.detect_lazy_flag("{ enabled: id != null }"))

    def test_no_lazy_when_enabled_true(self):
        self.assertIsNone(scan.detect_lazy_flag("{ enabled: true }"))

    def test_no_lazy_when_missing(self):
        self.assertIsNone(scan.detect_lazy_flag("{ queryKey, queryFn }"))


class ResolveEndpointForHookTest(unittest.TestCase):
    def test_score_tiebreaker(self):
        endpoints = {
            "investors": [{"verb": "GET", "url": "/investors/lookup", "is_template": False}],
            "investor-types": [{"verb": "GET", "url": "/investor-types/lookup", "is_template": False}],
        }
        result = scan.resolve_endpoint_for_hook("useInvestorTypesLookup", endpoints)
        self.assertIsNotNone(result)
        _, url = result
        self.assertIn("/investor-types", url)

    def test_no_match(self):
        self.assertIsNone(scan.resolve_endpoint_for_hook("useSomeHook", {}))


class ScanEndpointsTest(unittest.TestCase):
    def test_basic_endpoints(self):
        with tempfile.TemporaryDirectory() as tmp:
            services = Path(tmp) / "services"
            services.mkdir()
            (services / "projects-api-adapter.ts").write_text(
                'async () => { const r = await axiosClient.post("/projects/search", {}); return r; }\n'
                'async (id) => { const r = await axiosClient.get(`/projects/${id}`); return r; }\n',
                encoding="utf-8",
            )
            endpoints, factory, mock_only = scan.scan_endpoints(services)
            self.assertIn("projects", endpoints)
            urls = [ep["url"] for ep in endpoints["projects"]]
            self.assertIn("/projects/search", urls)
            self.assertEqual(len(factory), 0)
            self.assertEqual(len(mock_only), 0)

    def test_factory_detection(self):
        with tempfile.TemporaryDirectory() as tmp:
            services = Path(tmp) / "services"
            services.mkdir()
            (services / "projects-api-adapter.ts").write_text("export const a = {};", encoding="utf-8")
            (services / "projects-mock-adapter.ts").write_text("export const m = {};", encoding="utf-8")
            (services / "projects-service-factory.ts").write_text(
                "import { projectsApiAdapter } from './projects-api-adapter';\n"
                "export const getProjectsService = () => projectsApiAdapter;",
                encoding="utf-8",
            )
            _, factory, _ = scan.scan_endpoints(services)
            self.assertIn("projects", factory)


class FindModuleDirTest(unittest.TestCase):
    def test_missing_module(self):
        original = scan.REPO
        scan.REPO = Path(tempfile.gettempdir())
        try:
            self.assertIsNone(scan.find_module_dir("nonexistent_xyz_123"))
        finally:
            scan.REPO = original


if __name__ == "__main__":
    unittest.main(verbosity=2)
