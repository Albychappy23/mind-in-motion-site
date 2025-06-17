import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

interface Resource {
  id: number;
  title: string;
  url: string;
}

interface ResourcesProps {
  resources: Resource[];
}

export default function Resources({ resources }: ResourcesProps) {
  const [filter, setFilter] = useState('');
  
  const filtered = resources.filter(r =>
    r.title.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="max-w-lg mx-auto p-4">
      <Input
        type="search"
        placeholder="Search resources..."
        value={filter}
        onChange={e => setFilter(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      />
      <Card>
        <CardContent className="p-4">
          <ul className="space-y-2">
            {filtered.map(r => (
              <li key={r.id} className="mb-2">
                <a 
                  href={r.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-600 hover:text-blue-800 underline transition-colors"
                >
                  {r.title}
                </a>
              </li>
            ))}
          </ul>
          {filtered.length === 0 && (
            <p className="text-slate-500 text-center py-4">
              No resources found matching your search.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}