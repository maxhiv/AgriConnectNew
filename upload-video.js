import { Storage } from '@google-cloud/storage';
import fs from 'fs';

const REPLIT_SIDECAR_ENDPOINT = "http://127.0.0.1:1106";

// Create storage client
const storage = new Storage({
  credentials: {
    audience: "replit",
    subject_token_type: "access_token",
    token_url: `${REPLIT_SIDECAR_ENDPOINT}/token`,
    type: "external_account",
    credential_source: {
      url: `${REPLIT_SIDECAR_ENDPOINT}/credential`,
      format: {
        type: "json",
        subject_token_field_name: "access_token",
      },
    },
    universe_domain: "googleapis.com",
  },
  projectId: "",
});

async function uploadVideo() {
  try {
    const publicSearchPaths = process.env.PUBLIC_OBJECT_SEARCH_PATHS;
    console.log('Public search paths:', publicSearchPaths);
    
    if (!publicSearchPaths) {
      console.error('PUBLIC_OBJECT_SEARCH_PATHS not set');
      return;
    }

    // Parse the first public path to get bucket and path info
    const firstPath = publicSearchPaths.split(',')[0].trim();
    console.log('First path:', firstPath);
    
    // Extract bucket name from path like "/bucket-name/public"
    const pathParts = firstPath.split('/').filter(p => p);
    const bucketName = pathParts[0];
    const bucketPath = pathParts.slice(1).join('/');
    
    console.log('Bucket name:', bucketName);
    console.log('Bucket path:', bucketPath);
    
    const bucket = storage.bucket(bucketName);
    const fileName = 'planter-video.mp4';
    const file = bucket.file(`${bucketPath}/videos/${fileName}`);
    
    console.log('Uploading to:', `${bucketPath}/videos/${fileName}`);
    
    // Upload the file
    await file.save(fs.readFileSync('./planter-video.mp4'), {
      metadata: {
        contentType: 'video/mp4',
        cacheControl: 'public, max-age=31536000', // Cache for 1 year
      },
    });
    
    console.log(`✅ Video uploaded successfully to: ${bucketName}/${bucketPath}/videos/${fileName}`);
    console.log(`🌐 Access URL will be: /public-objects/videos/${fileName}`);
    
  } catch (error) {
    console.error('❌ Upload failed:', error);
    throw error;
  }
}

uploadVideo().catch(console.error);