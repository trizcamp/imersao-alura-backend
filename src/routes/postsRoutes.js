import express from 'express';
import { listarPosts, criarNovoPost, uploadImagem, atualizarNovoPost} from '../controllers/postsController.js';
import multer from 'multer';
import cors from 'cors';

const corsOptions = {
  origin: "http://localhost:8000",
  optionsSuccessStatus: 200
}

// Configura o armazenamento do Multer para uploads de imagens
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      // Especifica o diretório para armazenar as imagens enviadas
      cb(null, 'uploads/'); // Substitua por seu caminho de upload desejado
    },
    filename: function (req, file, cb) {
      // Mantém o nome original do arquivo por simplicidade
      cb(null, file.originalname); // Considere usar uma estratégia de geração de nomes únicos para produção
    }
  });

const upload = multer({dest:"./uploads", storage})

const routes = (app) => {
    //dizer para o express usar json
    app.use(express.json());
    app.use(cors(corsOptions));
    //req = request, res = response
    //rota pra buscar todos os posts criados
    app.get("/posts", listarPosts);
    //rota pra criar uma postagem
    app.post("/posts", criarNovoPost);
    //atualizar nome do arquivo para o id dele
    app.post("/upload", upload.single("imagem"), uploadImagem )
    //rota para atualizar postagem
    app.put("/upload/:id", atualizarNovoPost)
}

export default routes; //diz que aquivo pode ser exportado