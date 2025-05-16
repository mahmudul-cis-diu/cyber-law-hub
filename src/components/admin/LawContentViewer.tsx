
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileTextIcon } from 'lucide-react';

interface LawContentViewerProps {
  content: string;
  maxHeight?: string;
}

const LawContentViewer = ({ content, maxHeight = '400px' }: LawContentViewerProps) => {
  return (
    <Card className="border border-gray-200">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-2 text-cyberlaw-navy">
          <FileTextIcon className="h-5 w-5" />
          <h3 className="font-medium">Law Content</h3>
        </div>
        <ScrollArea className={`pr-4 ${maxHeight ? `max-h-[${maxHeight}]` : ''}`}>
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default LawContentViewer;
