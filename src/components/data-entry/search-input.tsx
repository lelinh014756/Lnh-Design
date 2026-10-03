import { useState, useEffect, memo } from 'react';
import { Search, X } from 'lucide-react';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';

interface InputSearchProps {
  placeholder?: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  defaultValue?: string;
  className?: string;
  debounceTime?: number;
  isLoading?: boolean;
}

const SearchInput = ({
  placeholder = "Nhập nội dung...",
  onChange,
  onSubmit,
  defaultValue = "",
  className = "",
  debounceTime = 500,
  isLoading = false
}: InputSearchProps) => {
  const [searchTerm, setSearchTerm] = useState(defaultValue);

  // Xử lý Debounce: Chỉ trigger onChange sau khi người dùng dừng gõ 500ms
  useEffect(() => {
    const handler = setTimeout(() => {
      if (onChange) onChange(searchTerm);
    }, debounceTime);

    return () => clearTimeout(handler);
  }, [searchTerm, debounceTime, onChange]);

  const handleClear = () => {
    setSearchTerm('');
    onSubmit?.("");
  };

  return (
    <InputGroup className={cn("w-80", className)}>
      {/* Icon kính lúp ở đầu */}
      <InputGroupAddon>
        {isLoading ? <Spinner /> : <Search className="size-4 text-muted-foreground" />}
      </InputGroupAddon>

      <InputGroupInput
        disabled={isLoading}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') { onSubmit?.(searchTerm) } }}
        placeholder={placeholder}
        className={searchTerm ? "pr-10" : "pr-3"} // Tạo khoảng trống cho nút X ở cuối
      />

      {/* Nút X xóa nhanh - Chỉ hiện khi có nội dung */}
      {searchTerm && (
        <InputGroupAddon
          align="inline-end"
          className="cursor-pointer hover:text-foreground transition-colors"
          onClick={handleClear}
        >
          <X className="size-4 text-muted-foreground" />
        </InputGroupAddon>
      )}

      {/* <InputGroupAddon align="inline-end">
        <InputGroupButton variant="outline" className='dark:bg-slate-900'
          onClick={() => {
            onSubmit?.(searchTerm);
          }}
        >Tìm kiếm</InputGroupButton>
      </InputGroupAddon> */}
    </InputGroup>
  );
};

export default memo(SearchInput);