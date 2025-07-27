export enum TipoContato {
    CELULAR = "CELULAR",
    RESIDENCIAL = "RESIDENCIAL",
    COMERCIAL = "COMERCIAL",
    WHATSAPP = "WHATSAPP",
    TELEGRAM = "TELEGRAM",
    OUTRO = "OUTRO"
}

export const TipoContatoLabelMapping: Record<TipoContato, string> = {
    [TipoContato.CELULAR]: 'Celular',
    [TipoContato.RESIDENCIAL]: 'Residencial',
    [TipoContato.COMERCIAL]: 'Comercial',
    [TipoContato.WHATSAPP]: 'WhatsApp',
    [TipoContato.TELEGRAM]: 'Telegram',
    [TipoContato.OUTRO]: 'Outro'
};