
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { Button } from './button';
import { ExternalLink, CheckCircle2 } from 'lucide-react';
import guidesData from '@/data/localGuides.json';

interface LocalGuidesProps {
  filteredByTags?: string[];
  maxItems?: number;
}

const LocalGuides: React.FC<LocalGuidesProps> = ({ 
  filteredByTags = [], 
  maxItems = 5 
}) => {
  let guides = guidesData.guides;

  // Filter by tags if provided
  if (filteredByTags.length > 0) {
    guides = guides.filter(guide => 
      guide.topicTags.some(tag => 
        filteredByTags.some(filterTag => 
          tag.toLowerCase().includes(filterTag.toLowerCase())
        )
      )
    );
  }

  // Limit number of items
  guides = guides.slice(0, maxItems);

  if (guides.length === 0) {
    return null;
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          Related Local Guides
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {guides.map(guide => (
            <div key={guide.id} className="border-b border-gray-200 last:border-b-0 pb-4 last:pb-0">
              <div className="flex flex-wrap gap-2 mb-2">
                {guide.topicTags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <h3 className="font-semibold text-lg mb-2">{guide.title}</h3>
              <p className="text-muted-foreground mb-3">{guide.description}</p>
              
              <ul className="space-y-1 mb-4">
                {guide.keyPoints.map((point, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
              
              <div className="flex gap-3">
                <Button variant="outline" size="sm" asChild>
                  <a 
                    href={`/resources/${guide.id}`}
                    className="flex items-center gap-2"
                  >
                    View Local Guide
                  </a>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <a 
                    href={guide.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Original Resource
                  </a>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LocalGuides;
