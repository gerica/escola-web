import { Component, forwardRef, Input, OnInit, signal } from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import Quill from 'quill';
import TableUp, {
  defaultCustomSelect,
  TableAlign,
  TableMenuContextmenu,
  TableMenuSelect,
  TableResizeLine,
  TableResizeScale,
  TableSelection,
  TableVirtualScrollbar,
} from 'quill-table-up';

Quill.register({ [`modules/${TableUp.moduleName}`]: TableUp }, true);

export enum TipoMenuEnum {
  INLINE, POPUP
}

@Component({
  selector: 'editor-component',
  standalone: true,
  imports: [QuillModule, ReactiveFormsModule],
  templateUrl: './editor.component.html',
  styleUrls: ['./styles.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EditorComponent),
      multi: true
    }
  ]
})
export class EditorComponent implements OnInit {
  @Input() placeholder: string = '';
  @Input() height: string = '250px';
  @Input() tipo: TipoMenuEnum = TipoMenuEnum.INLINE;
  @Input() toolbarConfig: any[] = [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ align: [] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ indent: '-1' }, { indent: '+1' }],
    ['code-block', 'blockquote'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'image'],
    [{ color: [] }, { background: [] }],
    [{ script: 'sub' }, { script: 'super' }],
    [{ [TableUp.toolName]: [] }],
  ];

  control = new FormControl('');
  editorStyles = signal<any>({});
  modules = signal<any>({});

  ngOnInit(): void {
    this.configureModule();
    this.configureStyle();
  }

  private configureModule() {
    this.modules.set({
      toolbar: this.toolbarConfig,
      [TableUp.moduleName]: {
        full: false,
        fullSwitch: true,
        icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><!-- Icon from Tabler Icons by Paweł Kuna - https://github.com/tabler/tabler-icons/blob/master/LICENSE --><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zm0 5h18M10 3v18"/></svg>',
        scrollbar: TableVirtualScrollbar,
        align: TableAlign,
        resize: TableResizeLine,
        resizeScale: TableResizeScale,
        resizeScaleOptions: {
          blockSize: 12,
        },
        customSelect: defaultCustomSelect,
        customBtn: true,
        selection: TableSelection,
        selectionOptions: {
          // selectColor: '#00ff8b4d',
          selectColor: '#ffe5994d',
          tableMenu: this.tipo === TipoMenuEnum.INLINE ? TableMenuSelect : TableMenuContextmenu,
          tableMenuOptions: {
            localstorageKey: 'used-color',
            tipText: true,
            defaultColorMap: [
              [
                'rgb(255, 255, 255)',
                'rgb(0, 0, 0)',
                'rgb(72, 83, 104)',
                'rgb(41, 114, 244)',
                'rgb(0, 163, 245)',
                'rgb(49, 155, 98)',
                'rgb(222, 60, 54)',
                'rgb(248, 136, 37)',
                'rgb(245, 196, 0)',
                'rgb(153, 56, 215)',
              ],
              [

                'rgb(242, 242, 242)',
                'rgb(127, 127, 127)',
                'rgb(243, 245, 247)',
                'rgb(229, 239, 255)',
                'rgb(229, 246, 255)',
                'rgb(234, 250, 241)',
                'rgb(254, 233, 232)',
                'rgb(254, 243, 235)',
                'rgb(254, 249, 227)',
                'rgb(253, 235, 255)',
              ],
            ],
          },
        },
        texts: {
          fullCheckboxText: 'Tabela com largura total',
          customBtnText: 'Personalizar linhas/colunas',
          confirmText: 'Confirmar',
          cancelText: 'Cancelar',
          rowText: 'Linhas',
          colText: 'Colunas',
          notPositiveNumberError: 'Por favor insira um número inteiro positivo',
          custom: 'Personalizado',
          clear: 'Limpar',
          transparent: 'Transparente',
          perWidthInsufficient: 'Largura percentual insuficiente. Para continuar, a tabela será convertida para largura fixa. Deseja prosseguir?',

          CopyCell: 'Copiar célula',
          CutCell: 'Recortar célula',
          InsertTop: 'Inserir linha acima',
          InsertRight: 'Inserir coluna à direita',
          InsertBottom: 'Inserir linha abaixo',
          InsertLeft: 'Inserir coluna à esquerda',
          MergeCell: 'Mesclar células',
          SplitCell: 'Dividir célula',
          DeleteRow: 'Excluir linha atual',
          DeleteColumn: 'Excluir coluna atual',
          DeleteTable: 'Excluir tabela atual',
          BackgroundColor: 'Definir cor de fundo',
          BorderColor: 'Definir cor da borda',
          SwitchWidth: 'Alternar largura da tabela',
          InsertCaption: 'Inserir título da tabela'
        },
      },
    });
  }

  private configureStyle() {
    this.editorStyles.set({
      height: this.height,
      backgroundColor: '#fff'
    });
  }

  writeValue(value: string): void {
    this.control.setValue(value || '');
  }

  registerOnChange(fn: any): void {
    this.control.valueChanges.subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    this.control.valueChanges.subscribe(() => fn());
  }

}
