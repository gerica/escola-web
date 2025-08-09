import { SortDirection } from "@angular/material/sort";

export interface PageSort {
  property: string;
  direction?: SortDirection | null;
}
