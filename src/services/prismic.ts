import * as Prismic from '@prismicio/client'


export const repositoryName = 'develop-ig-news'

const endpoint = Prismic.getEndpoint(repositoryName)

export const prismic = Prismic.createClient(endpoint, {

  accessToken: process.env.PRISMIC_ACESS_TOKEN
})


