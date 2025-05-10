'use client';

import { ProgressProvider } from '@bprogress/next/app';

export function ProgressBar() {
    return <ProgressProvider
        color="var(--link-udl-color-noncurrent-hover)" height='8px'
        delay={50}
        stopDelay={1}
        shallowRouting
        disableSameURL
        options={{
            speed: 500,
            //trickle: true,
            //trickleSpeed: 200,
            showSpinner: true,
            direction: 'ltr',
            minimum: 0.9,
            //maximum: 0.85,
        }}
        spinnerPosition="bottom-right"
    />;
}
