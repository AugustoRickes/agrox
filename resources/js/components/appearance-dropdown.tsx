import { Button } from '@/components/ui/button';
import { useAppearance } from '@/hooks/use-appearance';
import { Sun } from 'lucide-react';
import { HTMLAttributes } from 'react';

export default function AppearanceToggleDropdown({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
    const { updateAppearance } = useAppearance();

    return (
        <div className={className} {...props}>
            <Button
                variant="ghost"
                size="icon"
                className="h-11 w-11 rounded-md"
                onClick={() => updateAppearance('light')}
            >
                <Sun className="h-6 w-6" />
                <span className="sr-only">Light theme</span>
            </Button>
        </div>
    );
}
