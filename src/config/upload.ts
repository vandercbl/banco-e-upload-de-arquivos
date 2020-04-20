import path from 'path'; // módulo do próprio node
import crypto from 'crypto';
import multer from 'multer';

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');
// dirname parte do diretório de onde esse arquivo .ts está. O ..,.. é para voltar duas pastas. tmp é o nome da pasta de destino dos arquivos

export default {
  directory: tmpFolder,
  // criamos esse directory para poder utilizar em outros lugares no futuro

  // isso é para armazenar o arquivo dentro da nossa própria aplicação, mais para frente vamos ver como armazenar em algum serviço externo
  storage: multer.diskStorage({
    destination: tmpFolder,
    filename: (request, file, callback) => {
      const fileHash = crypto.randomBytes(10).toString('HEX');
      const fileName = `${fileHash}-${file.originalname}`;
      return callback(null, fileName);
    },
  }),
};
