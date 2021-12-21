import { useState, useEffect } from "react";
import './style.css';

import firebase from "./firebaseConnection";

function App() {

  const [idPost, setIdPost] = useState('');
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [posts, setPosts] = useState([]);

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const [user, setUser] = useState(false);
  const [userLogged, setUserLogged] = useState({}); // Objeto

  // Ciclo de vida, deixando a aplicação em realtime
  useEffect(()=>{
    async function loadPosts(){
      await firebase.firestore().collection('posts')
      .onSnapshot((doc)=>{
        let meuPosts = [];

        doc.forEach((item)=>{
          meuPosts.push({
            id: item.id,
            titulo: item.data().titulo,
            autor: item.data().autor
          })
        });

        setPosts(meuPosts);
      })
    }

    loadPosts();

  }, []);

  // Verifica se um usuário está logado no firebase
  useEffect( ()=>{
    async function checkLogin(){
      await firebase.auth().onAuthStateChanged( (user)=>{
        if(user){
          //se tem usuário logado entra aqui dentro
          setUser(true);
          setUserLogged({
            uid: user.uid,
            email: user.email
          })
        }else{
          //não possui nenhum usuário logado
          setUser(false);
          setUserLogged({});
        }
      })
    }

    checkLogin();

  }, []);

  // Função assincrona - para acessar o bd 
  async function handleAdd(){
    await firebase.firestore().collection('posts')
    /*  Criando id manual 
    .doc('12345')
    .set({
      titulo: titulo,
      autor: autor
    })
    */
    // Criando id automático
    .add({
      titulo: titulo,
      autor: autor
    })
    .then( () => {
      console.log("Dados cadastrados com sucesso!");
      // Limpar os campos da tela
      setTitulo('');
      setAutor('');  
    })
    .catch((error)=>{
      console.log("Gerou algum erro: " + error );
    })
  }

  // Função assincrona - para acessar o bd 
  async function buscaPost(){
    // Busca um a partir de um id especificado ex:.doc('123')
    await firebase.firestore().collection('posts')
    .doc(idPost)
    .get()
    .then( (snapshot) => {
      setTitulo(snapshot.data().titulo);
      setAutor(snapshot.data().autor);
    })
    .catch(()=>{
      console.log("Deu algum erro!");
    })
  }
  
  /*
    // Criando lista de todos os posts , para mostrar na tela
    await firebase.firestore().collection('posts')
    .get()
    .then( (snapshots) => {
      let lista = [];
      snapshots.forEach((doc) =>{
        lista.push({
          id: doc.id,
          titulo: doc.data().titulo,
          autor: doc.data().autor
        })
      })

      setPosts(lista);
    })
    .catch(()=>{
      console.log("Deu algum erro!");
    })
  }
  */

  async function editarPost(){
    await firebase.firestore().collection('posts')
    .doc(idPost)
    .update({
      titulo: titulo,
      autor: autor
    })
    .then(()=>{
      console.log('DADOS ATUALIZADOS COM SUCESSO');
      setIdPost('');
      setTitulo('');
      setAutor('');
    })
    .catch(()=>{
      console.log('Erro ao atualizar')
    })
  }

  async function excluirPost(id){
    await firebase.firestore().collection('posts')
    .doc(id)
    .delete()
    .then( ()=> {
      alert('Post excluído com sucesso.');
    })
    .catch(()=>{
      console.log('Erro na exclusão')
    })

  }

  async function novoUsuario(){
    await firebase.auth().createUserWithEmailAndPassword(email, senha)
    .then( (value)=>{
      console.log(value);
      setEmail('');
      setSenha('');
    })
    .catch( (error)=>{
      if(error.code === 'auth/weak-password'){
        alert('Senha muito fraca..');
      }else if(error.code === 'auth/email-already-in-use'){
          alert('Email informado já existe!');
      }else if(error.code === 'auth/invalid-email'){
              alert('Email invalido!');
      }
    })
  }

  async function logout(){
    await firebase.auth().signOut();
  }

  async function fazerLogin(){
    await firebase.auth().signInWithEmailAndPassword(email, senha)
    .then( (value)=>{
      console.log(value.user);
    })
    .catch( (error)=>{
      console.log('Erro ao fazer login ' + error );
    })
  }

  function limpar(){
    setTitulo('');
    setAutor('');  
    setIdPost('');
  }

  return (
    <div>
      <h1>React JS + Firebase :)</h1> <br/>

      {user && (
        <div>
          <strong>Seja bem vindo! (Você está logado!)</strong> <br/>
          <spam>{userLogged.uid} - {userLogged.email}</spam>
          <br/><br/>
        </div>  
      )}

      <div className="container">
        <label>Email:</label>
        <input type="text" value={email} onChange={ (e)=> setEmail(e.target.value)} /> <br/>

        <label>Senha:</label>
        <input type="password" value={senha} onChange={ (e)=> setSenha(e.target.value)} /> <br/>

        <button onClick={ fazerLogin }>Fazer Login</button>
        <button onClick={ novoUsuario }>Cadastrar</button>
        <button onClick={ logout }>Sair da conta</button>
      </div>

      <hr/><br/>

      <div className="container">
        <h2>Banco de Dados:</h2>
        <label>ID: </label>
        <input type="text" value={idPost} onChange={ (e)=> setIdPost(e.target.value)} />

        <label>Título: </label>
        <textarea type="text" value={titulo} onChange={ (e)=> setTitulo(e.target.value)} />

        <label>Autor: </label>
        <textarea type="text" value={autor} onChange={ (e)=> setAutor(e.target.value)} />

        <button onClick={ handleAdd }>Cadastrar</button>
        <button onClick={ buscaPost }>Buscar Post</button>
        <button onClick={ editarPost }>Editar</button> <br/>
        <button onClick={ limpar }>Limpar</button> <br/>

        <ul>
          {posts.map( (post) =>{
            return(
              <li key={post.id}>
                <span>ID: {post.id}</span> <br/>
                <span>Titulo: {post.titulo} </span> <br/>
                <span>Autor: {post.autor} </span> <br/>
                <button onClick={ ()=> excluirPost(post.id)}>Excluir Post</button> <br/> <br/>
              </li>
            )
          })}
        </ul>

      </div>

    </div>
  );
}

export default App;
