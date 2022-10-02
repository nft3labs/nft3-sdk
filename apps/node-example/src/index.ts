import { NFT3Client, NFT3Queryer, NFT3Verifier } from '@nft3sdk/client'

interface INote {
  title: string
  content: string
}

const solanaKey = 'Rrcv7QxrxCMr5JR9fvAmtt2NqFLNUdFFZdGZvqjowQDCQd5uR8XZnzWYh9xSuUQXTPbTTMAX4EfhHAyy4eA9ET7'
const privateKey = `0x71c9b1ea922e10a1d16da953dddfafa80c96c5a7049e4e968898e94ab9c72c39`
const gatewayEndpoint = 'https://t0.onebitdev.com/nft3-gateway/'
const queryerEndpoint = 'https://t0.onebitdev.com/nft3-queryer/'
const verifierEndpoint = 'https://t0.onebitdev.com/nft3-verifier/'
const postModelId = 'testmodel-post'
const postDataId = '206708bb-5c25-4a7f-a772-9ac6da69e0c3'

const solanaClient = new NFT3Client(gatewayEndpoint)
solanaClient.did.config({
  network: 'solana',
  privateKey: solanaKey
})

const client = new NFT3Client(gatewayEndpoint)
client.did.config({
  network: 'ethereum',
  privateKey
})
const verifier = new NFT3Verifier(client, verifierEndpoint)

async function solanaRegister() {
  try {
    const result = await solanaClient.did.register('laozhao')
    console.log(result)
  } catch (error) {
    console.trace(error)
  }
}

async function solanaLogin() {
  try {
    const result = await solanaClient.did.login()
    console.log(result)
  } catch (error) {
    console.trace(error)
  }
}

async function register() {
  const result = await client.did.register('laozhang')
  console.log(result)
}

async function login() {
  const result = await client.did.login()
  console.log(result)
}

async function checkLogin() {
  await client.did.auth()
  const result = await client.did.checkLogin()
  console.log(result)
}

async function accounts() {
  await client.did.auth()
  const result = await client.did.accounts()
  console.log(result)
}

async function getProfile() {
  const profile = await client.profile.info('did:nft3:laozhao')
  console.log(profile)
}

async function setProfile() {
  try {
    await client.did.auth()
    await client.profile.update({
      name: 'Laozhang',
      avatar: 'ipfs://QmSAnbgZSwuCiFcw1u912UqETfVxnKPqkKH8YGr1mirGSu',
      bio: "I'm Laozhang",
      location: 'HK',
      gender: '',
      url: '',
      attrs: []
    })
  } catch (error) {
    console.trace(error)
  }
}

async function createModel() {
  try {
    await client.did.auth()
    const appSchema = client.schema()
    const result = await appSchema.create({
      name: 'testmodel-post',
      description: 'post list',
      schema: {
        title: 'Post',
        type: 'object',
        properties: {
          title: {
            type: 'string'
          },
          content: {
            type: 'string'
          }
        },
        required: ['title', 'content']
      }
    })
    console.log(result)
  } catch (error) {
    console.trace(error)
  }
}

async function modelInfo() {
  const schema = client.schema()
  const result = await schema.get(postModelId)
  console.log(result)
}

async function modelInsert() {
  try {
    await client.did.auth()
    const noteModel = client.model<INote>(postModelId)
    const result = await noteModel.insertOne({
      title: 'test title 1',
      content: 'test content 1'
    })
    console.log(result)
  } catch (error) {
    console.trace(error)
  }
}

async function modelQuery() {
  const noteModel = client.model<INote>(postModelId)
  const result = await noteModel.find({
    query: {
      dataid: postDataId
    }
  })
  console.log(result)
}

async function modelUpdate() {
  try {
    await client.did.auth()
    const noteModel = client.model<INote>(postModelId)
    await noteModel.updateOne(postDataId, {
      title: 'test title 11a',
      content: 'test content 11a'
    })
  } catch (error) {
    console.trace(error)
  }
}

async function requestTwitter() {
  await client.did.auth()
  const info = verifier.requestTwitter()
  console.log(info)
}

async function verifyTwitter() {
  await client.did.auth()
  const result = await verifier.verifyTwitter(
    'Bart200c',
    '0xe210debb1bad992a0dc373a95f4fbd2d04024d302e498486b214c0af8666f261'
  )
  console.log(result)
}

async function verifyProof() {
  const info = {
    did: 'did:nft3:alice',
    proof:
      'c27eb0858955ad7e1722b2f45a5d3f733db6ced22c35d65bc512fdcf4e19df0758da82c5d77692f37fe7aeaab24955fbd3afe9ece37f00d491e7d5da11a1a6bc01',
    account: 'Bart200c',
    type: 'twitter',
    verifier_key: ''
  }
  const result = verifier.verifyProof(info)
  console.log(result)
}

async function query() {
  const queryer = new NFT3Queryer(queryerEndpoint)
  const data = await queryer.query({
    tokens: {
      did: 'did:nft3:alice',
      limit: 2
    }
  })
  console.log(data)
}

async function timeline() {
  const queryer = new NFT3Queryer(queryerEndpoint)
  const data = await queryer.query({
    tokens: {
      did: 'did:nft3:cat',
      offset: 0,
      limit: 5
    },
    timeline: {
      did: 'did:nft3:cat',
      offset: 0,
      limit: 5
    },
    ens: {
      did: 'did:nft3:cat'
    }
  })
  console.log(data)
}

async function follow() {
  await client.did.auth()
  const result = await client.follow.follow('did:nft3:cat')
  console.log(result)
}

async function unfollow() {
  await client.did.auth()
  const result = await client.follow.unfollow('did:nft3:cat')
  console.log(result)
}

async function followCount() {
  const result = await client.follow.count('did:nft3:laozhang')
  console.log(result)
}

async function following() {
  const result = await client.follow.following({
    identifier: 'did:nft3:laozhang'
  })
  console.log(result)
}

async function followers() {
  const result = await client.follow.followers({
    identifier: 'did:nft3:cat'
  })
  console.log(result)
}

async function count() {
  const noteModel = client.model('follow')
  const result = await noteModel.count({
    identifier: 'did:nft3:laozhang',
    count: {}
  })
  console.log(result)
}

async function search() {
  const result = await client.did.search({
    keyword: 'n',
    mode: 'didname'
  })
  console.log(result)
}

search()
