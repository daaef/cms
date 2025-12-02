import type { PayloadHandler } from 'payload'
import { sql } from 'drizzle-orm'

/**
 * One-time endpoint to clear all malformed croppedUrl values from media records
 * This is needed after fixing the Cloudinary transformation parameter order
 *
 * Usage: POST /api/clear-cropped-urls
 */
export const clearCroppedUrls: PayloadHandler = async (req, res) => {
  try {
    const { payload } = req

    // Log the operation
    payload.logger.info('[clearCroppedUrls] Starting to clear malformed croppedUrl values')

    // Update all media records to clear croppedUrl field
    const result = await payload.db.drizzle
      .update(payload.db.tables.media)
      .set({ croppedUrl: null })
      .where(sql`cropped_url IS NOT NULL`)

    payload.logger.info(`[clearCroppedUrls] Successfully cleared ${result.rowCount || 0} croppedUrl values`)

    res.status(200).json({
      success: true,
      message: `Cleared ${result.rowCount || 0} malformed croppedUrl values`,
      cleared: result.rowCount || 0,
    })
  } catch (error) {
    req.payload.logger.error('[clearCroppedUrls] Error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to clear croppedUrl values',
      details: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}
