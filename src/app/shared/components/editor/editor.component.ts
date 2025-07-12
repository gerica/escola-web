import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideQuillConfig } from 'ngx-quill/config';
import { FormControl } from '@angular/forms';
import Quill from 'quill';
import TableUp, {
  defaultCustomSelect,
  TableMenuSelect,
  TableResizeLine,
  TableResizeScale,
  TableSelection,
  TableVirtualScrollbar,
} from 'quill-table-up';

Quill.register({ [`modules/${TableUp.moduleName}`]: TableUp }, true);

@Component({
  selector: 'editor-component',
  styleUrls: ['../styles.scss'],
  standalone: false,
  templateUrl: './editor.component.html'
})
export class EditorComponent {
  // Complete toolbar configuration
  toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],

    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
    [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
    [{ 'direction': 'rtl' }],                         // text direction

    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'font': [] }],
    [{ 'align': [] }],

    ['clean'],                                         // remove formatting button

    ['link', 'image', 'video'],                        // link and media

    [{ [TableUp.toolName]: [] }]
  ];
  modules: any = {
    toolbar: this.toolbarOptions,
    [TableUp.moduleName]: {
      scrollbar: TableVirtualScrollbar,
      resize: TableResizeLine,
      resizeScale: TableResizeScale,
      customSelect: defaultCustomSelect,
      selection: TableSelection,
      selectionOptions: {
        tableMenu: TableMenuSelect,
      },
    },
  };

  contentCtrl = new FormControl('');
  saved = false;
  showEditor = true;

  // In your component class
  editorStyles = {
    height: '250px',
    backgroundColor: '#fff'
  };
}

bootstrapApplication(EditorComponent, {
  providers: [provideQuillConfig({})],
});
