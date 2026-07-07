import 'server-only'
import { client } from '@/lib/sanity/client'
import { writeClient } from '@/lib/sanity/write-client'

export async function createComment(data: { postId: string; authorName: string; body: string }) {
  return writeClient.create({
    _type: 'comment',
    post: { _type: 'reference', _ref: data.postId },
    authorName: data.authorName,
    body: data.body,
    visible: false,
    createdAt: new Date().toISOString(),
  })
}

export async function getVisibleComments(postId: string) {
  return client.fetch<{ _id: string; authorName: string; body: string; createdAt: string }[]>(
    `*[_type == "comment" && post._ref == $postId && visible == true] | order(createdAt asc) { _id, authorName, body, createdAt }`,
    { postId }
  )
}

export async function getPendingComments() {
  return writeClient.fetch<{ _id: string; authorName: string; body: string; createdAt: string; post: { title: string } }[]>(
    `*[_type == "comment" && visible == false] | order(createdAt desc) { _id, authorName, body, createdAt, post->{ title } }`
  )
}

export async function getApprovedComments() {
  return writeClient.fetch<{ _id: string; authorName: string; body: string; createdAt: string; post: { title: string } }[]>(
    `*[_type == "comment" && visible == true] | order(createdAt desc) { _id, authorName, body, createdAt, post->{ title } }`
  )
}

export async function approveComment(id: string) {
  return writeClient.patch(id).set({ visible: true }).commit()
}

export async function rejectComment(id: string) {
  return writeClient.delete(id)
}

export async function deleteComment(id: string) {
  return writeClient.delete(id)
}