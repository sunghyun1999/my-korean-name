"use client";

import { useState, useEffect } from "react";

interface ShareButtonsProps {
  name: string;
  koreanName: string;
}

export default function ShareButtons({ name, koreanName }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  const shareText = `My Korean name is ${koreanName}! (${name}) Find yours:`;

  useEffect(() => {
    setShareUrl(window.location.href);
    setCanNativeShare(!!navigator.share);
  }, []);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `My Korean Name: ${koreanName}`,
          text: shareText,
          url: shareUrl,
        });
      } catch {
        // user cancelled
      }
    }
  };

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    shareText
  )}&url=${encodeURIComponent(shareUrl)}`;

  const redditUrl = `https://www.reddit.com/submit?url=${encodeURIComponent(
    shareUrl
  )}&title=${encodeURIComponent(`My Korean name is ${koreanName}!`)}`;

  return (
    <div className="flex flex-col items-center gap-3 w-full max-w-lg mx-auto">
      {/* Try your name CTA */}
      <a
        href="/"
        className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500
                   text-white text-center font-bold text-lg cursor-pointer
                   hover:from-rose-600 hover:to-pink-600 transition-all
                   transform hover:scale-[1.02] active:scale-[0.98]"
      >
        Get Your Korean Name
      </a>

      {/* Native Share (모바일) */}
      {canNativeShare && (
        <button
          onClick={handleNativeShare}
          className="w-full py-3 px-6 rounded-2xl bg-gray-900 text-white font-medium
                     hover:bg-gray-800 transition-colors cursor-pointer"
        >
          Share Result
        </button>
      )}

      <div className="flex gap-3 w-full">
        {/* Twitter/X */}
        <a
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-3 px-4 rounded-2xl bg-black text-white text-center
                     font-medium hover:bg-gray-800 transition-colors text-sm cursor-pointer"
        >
          Post on X
        </a>

        {/* Reddit */}
        <a
          href={redditUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-3 px-4 rounded-2xl bg-orange-500 text-white text-center
                     font-medium hover:bg-orange-600 transition-colors text-sm cursor-pointer"
        >
          Share on Reddit
        </a>
      </div>

      {/* Copy Link */}
      <button
        onClick={handleCopyLink}
        className="w-full py-3 px-4 rounded-2xl border-2 border-gray-200
                   text-gray-700 font-medium hover:bg-gray-50 transition-colors text-sm cursor-pointer"
      >
        {copied ? "Copied!" : "Copy Link"}
      </button>
    </div>
  );
}
