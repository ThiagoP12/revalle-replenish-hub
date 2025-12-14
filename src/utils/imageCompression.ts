/**
 * Comprime uma imagem antes do envio
 * @param file Arquivo de imagem
 * @param maxWidth Largura máxima (default: 1200px)
 * @param quality Qualidade da compressão (0-1, default: 0.7)
 * @returns Promise com a imagem comprimida em base64
 */
export async function compressImage(
  file: File,
  maxWidth: number = 1200,
  quality: number = 0.7
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Redimensionar se necessário
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Não foi possível criar contexto do canvas'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Comprimir para JPEG com a qualidade especificada
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedBase64);
      };
      img.onerror = () => reject(new Error('Erro ao carregar imagem'));
      img.src = event.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
    reader.readAsDataURL(file);
  });
}
