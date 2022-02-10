import { GetServerSideProps } from "next"
import { getSession, useSession } from "next-auth/react"
import Head from "next/head"
import { useRouter } from "next/router"
import { RichText } from "prismic-dom"
import { useEffect } from "react"
import { prismic } from "../../services/prismic"
import styles from './post.module.scss'

interface PostProps {
    post:{
        slug: string;
        title: string;
        content: string;
        updateAt: string;

    }
}

export default function Post({post}:PostProps){
    const {data: session} = useSession();
    const router = useRouter();

    useEffect(() => {
        if(!session?.activeSubscrition){
            router.push(`/post;${post.slug}`)
        }
    },[session])
    
    return(
        <>
        <Head>
            <title>{post.title}</title>
        </Head>

        <main className={styles.container}>
            <article className={styles.post}>
                <h1>{post.title}</h1>
                <time>{post.updateAt}</time>
                <div 
                className={styles.postContent}
                dangerouslySetInnerHTML={{__html:post.content}}>
                    
                </div>
                

            </article>
        </main>

        </>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ req,params }) =>{
    const session = await getSession({req})
    const {slug} = params
    if (!session?.activeSubscrition){
        return{
            redirect:{
                destination:'/',
                permanent:false,
            }
        }

    }

     const response = await prismic.getByUID('publication',String(slug))
     console.log(response)

    const post = {
        slug,
        title:RichText.asText(response.data.title),
        content: RichText.asHtml(response.data.content),
        updateAt: new Date(response.last_publication_date).toLocaleDateString('pt-BR',
            {
                day:'2-digit',
                month: 'long',
                year: 'numeric'
            }
        ),

    };

    return {
        props:{
            post,
        }
    }
}