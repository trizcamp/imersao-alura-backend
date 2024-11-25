//camada que faz conexao da aplicação com o banco de dados
//camada que cuida dos dados
import 'dotenv/config';
import conectarAoBanco from "../config/dbconfig.js";
import { ObjectId } from "mongodb";
// chamando a função passando a string de conexao
//env é variavel de ambiente
const conexao = await conectarAoBanco(process.env.CONNECTION_STRING);

//função assincrona pra buscar todos os posts
export async function getTodosOsPosts(){
    //nome do database no mongodb
    const db = conexao.db("imersao-instabytes");
    //nome da coleção no mongodb
    const colecao = db.collection('posts');
    return colecao.find().toArray(); // coneverte para um array
};

export async function criarPost(novoPost){
        const db = conexao.db("imersao-instabytes");
        const colecao = db.collection('posts');
        return colecao.insertOne(novoPost);
}

export async function atualizarPost(id, novoPost){
        const db = conexao.db("imersao-instabytes");
        const colecao = db.collection('posts');
        //coloar o id em um objeto em que o mongo entenda
        const objId = ObjectId.createFromHexString(id);
        //passando qual é o id do post que quer ser atualizado
        return colecao.updateOne({_id: new ObjectId(objId)}, {$set:novoPost}); 
}
