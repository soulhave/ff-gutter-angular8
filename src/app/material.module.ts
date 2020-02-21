import {NgModule} from '@angular/core';
import {MatToolbarModule} from '@angular/material';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatExpansionModule} from '@angular/material/expansion';
import {NgMatSearchBarModule} from 'ng-mat-search-bar';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@NgModule({
  declarations: [],
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatExpansionModule,
    NgMatSearchBarModule,
    ScrollingModule,
    MatProgressSpinnerModule
  ],
  exports: [
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatExpansionModule,
    NgMatSearchBarModule,
    ScrollingModule,
    MatProgressSpinnerModule
  ]
})
export class MaterialModule { }
