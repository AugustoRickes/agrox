import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';
import { useSyncService } from './services/syncService';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

// This component will ensure our sync service is always running.
function SyncServiceProvider() {
    useSyncService();
    return null; // This component does not render anything.
}

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <>
                <SyncServiceProvider />
                <App {...props} />
            </>
        );
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light mode on load...
initializeTheme();
