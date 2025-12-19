import { supabase } from '@/integrations/supabase/client';

/**
 * Converte uma string base64 para Blob
 */
function base64ToBlob(base64: string): Blob {
  // Remove o prefixo data:image/xxx;base64,
  const base64Data = base64.split(',')[1] || base64;
  const mimeType = base64.match(/data:([^;]+);/)?.[1] || 'image/jpeg';
  
  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);
  
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
}

/**
 * Faz upload de uma foto base64 para o storage e retorna a URL pública
 */
export async function uploadFotoParaStorage(
  base64: string,
  protocoloNumero: string,
  tipoFoto: string
): Promise<string | null> {
  try {
    const blob = base64ToBlob(base64);
    const extensao = blob.type.split('/')[1] || 'jpg';
    const nomeArquivo = `${protocoloNumero}/${tipoFoto}_${Date.now()}.${extensao}`;

    const { data, error } = await supabase.storage
      .from('fotos-protocolos')
      .upload(nomeArquivo, blob, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Erro ao fazer upload da foto:', error);
      return null;
    }

    // Retorna a URL pública
    const { data: publicUrlData } = supabase.storage
      .from('fotos-protocolos')
      .getPublicUrl(data.path);

    return publicUrlData.publicUrl;
  } catch (error) {
    console.error('Erro ao processar upload da foto:', error);
    return null;
  }
}

/**
 * Faz upload de todas as fotos do protocolo e retorna um objeto com as URLs
 */
export async function uploadFotosProtocolo(
  fotosProtocolo: {
    fotoMotoristaPdv?: string | null;
    fotoLoteProduto?: string | null;
    fotoAvaria?: string | null;
  },
  protocoloNumero: string
): Promise<{
  fotoMotoristaPdv?: string;
  fotoLoteProduto?: string;
  fotoAvaria?: string;
}> {
  const resultado: {
    fotoMotoristaPdv?: string;
    fotoLoteProduto?: string;
    fotoAvaria?: string;
  } = {};

  const uploads = [];

  if (fotosProtocolo.fotoMotoristaPdv) {
    uploads.push(
      uploadFotoParaStorage(fotosProtocolo.fotoMotoristaPdv, protocoloNumero, 'motorista_pdv')
        .then(url => { if (url) resultado.fotoMotoristaPdv = url; })
    );
  }

  if (fotosProtocolo.fotoLoteProduto) {
    uploads.push(
      uploadFotoParaStorage(fotosProtocolo.fotoLoteProduto, protocoloNumero, 'lote_produto')
        .then(url => { if (url) resultado.fotoLoteProduto = url; })
    );
  }

  if (fotosProtocolo.fotoAvaria) {
    uploads.push(
      uploadFotoParaStorage(fotosProtocolo.fotoAvaria, protocoloNumero, 'avaria')
        .then(url => { if (url) resultado.fotoAvaria = url; })
    );
  }

  await Promise.all(uploads);

  return resultado;
}
