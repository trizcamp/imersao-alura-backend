//uma controller passa toda a responsabilidade de lidar com as respostas

import {getTodosOsPosts, criarPost, atualizarPost} from "../models/postsModel.js";
import fs from "fs";
import gerarDescricaoComGemini from "../services/geminiService.js"
import 'dotenv/config';

export async function listarPosts (req, res) {
    const posts = await getTodosOsPosts();
    //responde com o status 200 e os posts do banco de dados
    res.status(200).json(posts);
}

// função para criar novo post passando a requisição e a resposta
export async function criarNovoPost(req, res){
    const novoPost = req.body;
    try{
        const postCriado = await criarPost(novoPost);
        res.status(200).json(postCriado);
    } catch(err){
        console.error(err.message);
        res.status(500).json({"Erro": "Falha na requisição"})
    }
}
export async function uploadImagem(req, res) {
    const novoPost = {
        descricao: "",
        imgUrl: req.file.originalname,
        alt: ""
    };

    try {
        const postCriado = await criarPost(novoPost);
        const imagemAtualizada = `uploads/${postCriado.insertedId}.png`
        fs.renameSync(req.file.path, imagemAtualizada)
        res.status(200).json(postCriado);  
    } catch(erro) {
        console.error(erro.message);
        res.status(500).json({"Erro":"Falha na requisição"})
    }
}

export async function atualizarNovoPost(req, res){
    const id = req.params.id;
    const urlImagem = `http://localhost:3000/${id}.png`
    try{
        const imgBuffer = fs.readFileSync(`uploads/${id}.png`);
        const descricao = await gerarDescricaoComGemini(imgBuffer)
        const postAtualizado = {
            imgUrl: urlImagem,
            descricao: descricao,
            alt: req.body.alt 
        };
        //atualiza o post recebendo o id
        const postCriado = await atualizarPost(id, postAtualizado);
        res.status(200).json(postCriado);
    } catch(err){
        console.error(err.message);
        res.status(500).json({"Erro": "Falha na requisição :"})
    }
}