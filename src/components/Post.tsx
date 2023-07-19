import { Comment } from './Comment';
import { Avatar } from './Avatar';
import styles from './Post.module.css';
import { format, formatDistanceToNow } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { ChangeEvent, FormEvent, InvalidEvent, useState } from 'react';


interface Author {
  name: string;
  role: string;
  avatarUrl: string;
}

interface Content {
  type: 'paragraph' | 'link';
  content: string;
}

export interface PostType {
  id: number;
  author: Author;
  publishedAt: Date;
  content: Content[];
}

interface PostProps {
  post: PostType;
}

export function Post({ post }: PostProps) {
  const [comments, setComments] = useState([
    'Muito legal esse negóçu aí!'
  ]);
  const [newComment, setNewComment] = useState('');

  const publishedDateFormated = format(post.publishedAt, "d 'de' LLLL 'às' HH:mm'h'", {
    locale: ptBR
  });
  const publishedDateRelativetoNow = formatDistanceToNow(post.publishedAt, {
    locale: ptBR,
    addSuffix: true
  });


  function deleteComment(deletedComment: string) {
    console.log('seu cu bebe' + deletedComment);
    const newCommentList = comments.filter(item => item !== deletedComment);
    setComments(newCommentList);
  }

  function handleCreateNewComment(event: FormEvent) {
    event.preventDefault();
    setComments([...comments, newComment]);
    setNewComment('');

  }

  function handleNewCommentChange(event: ChangeEvent<HTMLTextAreaElement>) {
    event.target.setCustomValidity('');
    setNewComment(event.target.value)
  }
  function handleNewCommentInvalid(event: InvalidEvent<HTMLTextAreaElement>) {
    event.target.setCustomValidity('Obrigatório informar um texto para salvar bebe!');
  }

  return (
    <article className={styles.post}>
      <header>
        <div className={styles.author}>
          <Avatar src={post.author.avatarUrl} />
          <div className={styles.authorInfo}>
            <strong>{post.author.name}</strong>
            <span>{post.author.role}</span>
          </div>
        </div>

        <time title={publishedDateFormated} dateTime={post.publishedAt.toISOString()} >
          {publishedDateRelativetoNow}
        </time>
      </header>

      <div className={styles.content} >
        {post.content.map(item => {
          if (item.type === 'paragraph') {
            return <p key={item.content}>{item.content}</p>
          } else {
            return <p key={item.content}><a href="#">{item.content}</a></p>
          }
        })}

      </div>
      <form onSubmit={handleCreateNewComment} className={styles.commentForm}>
        <strong>Deixe seu feedback</strong>
        <textarea
          onChange={handleNewCommentChange}
          value={newComment}
          placeholder='Deixe um comentário'
          required
          onInvalid={handleNewCommentInvalid}
        ></textarea>
        <footer>
          <button disabled={!newComment} type='submit'>Publicar</button>
        </footer>
      </form>
      <div className={styles.commentList} >
        {comments.map(item => {
          return <Comment key={item} content={item} onDeleteComment={deleteComment} />;
        })}
      </div>
    </article>
  )
}
