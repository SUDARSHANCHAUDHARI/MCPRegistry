// API for collections management
import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import {
  getUserCollections,
  createCollection,
  addServerToCollection,
  getCollectionServers,
} from '@/lib/db-features'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const collectionId = searchParams.get('collectionId')

    if (collectionId) {
      // Get servers in collection
      const servers = await getCollectionServers(collectionId)
      return NextResponse.json({ servers })
    }

    if (userId) {
      // Get user's collections
      const collections = await getUserCollections(userId)
      return NextResponse.json({ collections })
    }

    return NextResponse.json({ error: 'userId or collectionId required' }, { status: 400 })
  } catch (error) {
    console.error('Collections error:', error)
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const {
      action,
      userId,
      name,
      description,
      isPublic,
      collectionId,
      serverId,
    } = await request.json()

    const supabase = await createServerClient()
    const user = await supabase.auth.getUser()
    if (!user.data.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (action === 'create') {
      const collection = await createCollection(user.data.user.id, name, description, isPublic)
      return NextResponse.json({ collection })
    }

    if (action === 'addServer') {
      const success = await addServerToCollection(collectionId, serverId)
      return NextResponse.json({ success })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Collections error:', error)
    return NextResponse.json({ error: 'Failed to process' }, { status: 500 })
  }
}
