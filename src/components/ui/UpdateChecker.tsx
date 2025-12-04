'use client';

import { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';

interface ReleaseInfo {
  version: string;
  downloadUrl: string;
  releaseNotes: string;
}

// Current app version from package.json (injected at build time)
const CURRENT_VERSION = process.env.APP_VERSION || '1.0.0';
const GITHUB_REPO = 'sachnun/sukanime';

export default function UpdateChecker() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [releaseInfo, setReleaseInfo] = useState<ReleaseInfo | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [isNativeApp, setIsNativeApp] = useState(false);

  useEffect(() => {
    // Check if running in Capacitor (native app)
    const isCapacitor = typeof window !== 'undefined' && 
      (window as unknown as { Capacitor?: { isNativePlatform?: () => boolean } }).Capacitor?.isNativePlatform?.();
    
    setIsNativeApp(!!isCapacitor);

    // Only check for updates in native app
    if (!isCapacitor) return;

    // Check if user dismissed this version
    const dismissedVersion = localStorage.getItem('dismissedUpdateVersion');
    
    const checkUpdate = async () => {
      try {
        // Fetch latest release from GitHub API
        const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/releases/latest`);
        if (!res.ok) return;
        
        const data = await res.json();
        const latestVersion = data.tag_name?.replace('v', '') || '';
        
        // Find APK asset
        const apkAsset = data.assets?.find((asset: { name: string }) => 
          asset.name.endsWith('.apk')
        );
        
        // Compare versions
        if (latestVersion && latestVersion !== CURRENT_VERSION && latestVersion !== dismissedVersion) {
          setReleaseInfo({
            version: latestVersion,
            downloadUrl: apkAsset?.browser_download_url || data.html_url,
            releaseNotes: data.html_url,
          });
          setUpdateAvailable(true);
        }
      } catch (error) {
        console.error('Failed to check for updates:', error);
      }
    };

    checkUpdate();
  }, []);

  const handleDismiss = () => {
    if (releaseInfo) {
      localStorage.setItem('dismissedUpdateVersion', releaseInfo.version);
    }
    setDismissed(true);
  };

  const handleUpdate = () => {
    if (releaseInfo?.downloadUrl) {
      window.open(releaseInfo.downloadUrl, '_blank');
    }
  };

  if (!isNativeApp || !updateAvailable || dismissed || !releaseInfo) {
    return null;
  }

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 animate-in slide-in-from-bottom-4">
      <div className="bg-card border border-white/10 rounded-lg p-4 shadow-lg">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h3 className="font-semibold text-white">Update Available</h3>
            <p className="text-sm text-muted mt-1">
              Version {releaseInfo.version} is now available. You have version {CURRENT_VERSION}.
            </p>
          </div>
          <button
            onClick={handleDismiss}
            className="text-muted hover:text-white transition-colors"
            aria-label="Dismiss"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex gap-2 mt-3">
          <button
            onClick={handleUpdate}
            className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white py-2 px-4 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            Download Update
          </button>
          <a
            href={releaseInfo.releaseNotes}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2 px-4 bg-secondary hover:bg-muted text-white rounded-lg transition-colors"
          >
            What&apos;s New
          </a>
        </div>
      </div>
    </div>
  );
}
