const { NFT3Client } = require('@nft3sdk/client')

const privateKey = `0x71c9b1ea922e10a1d16da953dddfafa80c96c5a7049e4e968898e94ab9c72c39`
const endpoint = 'http://t0.onebitdev.com:10000/'

const client = new NFT3Client(endpoint)
client.did.config({
  network: 'ethereum',
  privateKey
})

async function run() {
  const postModel = await client.schema().create({
    name: 'testapp-post',
    description: 'TestApp Post',
    schema: {
      title: 'Post',
      type: 'object',
      properties: {
        content: {
          type: 'string',
          maxLength: 200
        },
        imgs: {
          type: 'array',
          maxItems: 4,
          items: {
            type: 'string',
            pattern: '^ipfs://.+',
            maxLength: 150
          }
        }
      },
      required: ['content', 'imgs']
    }
  })
  const followModel = await client.schema().create({
    name: 'testapp-follow',
    description: 'TestApp Follow',
    schema: {
      title: 'Follow',
      type: 'object',
      properties: {
        userId: {
          type: 'string',
          pattern: '^did:nft3:.+',
          maxLength: 100
        },
        followingId: {
          type: 'string',
          pattern: '^did:nft3:.+',
          maxLength: 100
        }
      },
      required: ['userId', 'followingId']
    }
  })
}

run()
