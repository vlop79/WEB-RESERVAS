import { Button } from "@/components/ui/button";
import { Share2, Linkedin, Twitter, Facebook } from "lucide-react";
import { useState } from "react";

interface SocialShareButtonsProps {
  title: string;
  description: string;
  hashtags?: string[];
  url?: string;
}

export default function SocialShareButtons({ title, description, hashtags = [], url }: SocialShareButtonsProps) {
  const [showOptions, setShowOptions] = useState(false);
  
  // Use current URL if not provided
  const shareUrl = url || window.location.origin;
  
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);
  const encodedUrl = encodeURIComponent(shareUrl);
  const hashtagString = hashtags.map(tag => tag.replace('#', '')).join(',');

  const shareOnLinkedIn = () => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&title=${encodedTitle}&summary=${encodedDescription}`;
    window.open(linkedInUrl, '_blank', 'width=600,height=600');
  };

  const shareOnTwitter = () => {
    const text = `${title}\n\n${description}`;
    const encodedText = encodeURIComponent(text);
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}${hashtagString ? `&hashtags=${hashtagString}` : ''}`;
    window.open(twitterUrl, '_blank', 'width=600,height=600');
  };

  const shareOnFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedDescription}`;
    window.open(facebookUrl, '_blank', 'width=600,height=600');
  };

  return (
    <div className="relative inline-block">
      {!showOptions ? (
        <Button
          onClick={() => setShowOptions(true)}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <Share2 className="h-4 w-4" />
          Compartir
        </Button>
      ) : (
        <div className="flex gap-2 items-center">
          <Button
            onClick={shareOnLinkedIn}
            size="sm"
            className="bg-[#0077b5] hover:bg-[#006399] text-white gap-2"
          >
            <Linkedin className="h-4 w-4" />
            LinkedIn
          </Button>
          <Button
            onClick={shareOnTwitter}
            size="sm"
            className="bg-[#1da1f2] hover:bg-[#1a8cd8] text-white gap-2"
          >
            <Twitter className="h-4 w-4" />
            Twitter
          </Button>
          <Button
            onClick={shareOnFacebook}
            size="sm"
            className="bg-[#1877f2] hover:bg-[#166fe5] text-white gap-2"
          >
            <Facebook className="h-4 w-4" />
            Facebook
          </Button>
          <Button
            onClick={() => setShowOptions(false)}
            size="sm"
            variant="ghost"
          >
            ✕
          </Button>
        </div>
      )}
    </div>
  );
}
