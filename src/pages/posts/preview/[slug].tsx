import { GetStaticProps } from "next"
import { getSession, useSession } from "next-auth/react"
import Head from "next/head"
import Link from "next/link"
import { RichText } from "prismic-dom"
import { prismic } from "../../../services/prismic"
import styles from '../post.module.scss'

interface PostPreviewProps {
    post:{
        slug: string;
        title: string;
        content: string;
        updateAt: string;

    }
}

export default function PostPreview({post}:PostPreviewProps){
 
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
                className={`${styles.postContent} ${styles.previewContent}`}
                dangerouslySetInnerHTML={{__html:post.content}}
                />
                <div className="styles.continueReading">
                    Wanna continue reading? <Link href=''><a>Subscribe now🤗</a></Link>
                </div>

            </article>
        </main>

        </>
    )
}
export const getStaticPaths = ()=> {
    return{
        patchs: [],
        fallbacks: 'blocking'
    }
}

export const getStaticProps: GetStaticProps = async ({ params }) =>{
    const session = await getSession()
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
        content: RichText.asHtml(response.data.content.splice(0,3)),
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
        },
        redirect:60*30,
    }
}