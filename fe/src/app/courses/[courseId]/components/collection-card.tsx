"use client";

import Link from "next/link";
import { Layers, Play, User, Settings } from "lucide-react";
import { CollectionResponse } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface CollectionCardProps {
  collection: CollectionResponse;
}

export function CollectionCard({ collection }: CollectionCardProps) {
  return (
    <Card className="h-full transition-all hover:shadow-lg hover:border-primary/50 group">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
          {collection.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {collection.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {collection.description}
          </p>
        )}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Layers className="h-4 w-4" />
            <span>{collection.cardCount} cards</span>
          </div>
          <Badge variant="secondary" className="text-xs">
            <User className="h-3 w-3 mr-1" />
            {collection.createdByUsername}
          </Badge>
        </div>
        <div className="flex gap-2">
          <Link href={`/collections/${collection.id}`} className="flex-1">
            <Button variant="outline" className="w-full gap-2">
              <Settings className="h-4 w-4" />
              Manage
            </Button>
          </Link>
          <Link href={`/study/${collection.id}`} className="flex-1">
            <Button className="w-full gap-2">
              <Play className="h-4 w-4" />
              Study
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
