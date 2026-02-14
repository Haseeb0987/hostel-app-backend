/**
 * Standardized API Response Helper
 *
 * Every API response follows the shape:
 * {
 *   success: boolean,
 *   message: string,
 *   data:    object | null,
 *   error:   object | null
 * }
 */

class ApiResponse {
  /**
   * Send a success response.
   * @param {import('express').Response} res
   * @param {object}  options
   * @param {number}  [options.statusCode=200]
   * @param {string}  options.message
   * @param {*}       [options.data=null]
   */
  static success(res, { statusCode = 200, message, data = null }) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      error: null,
    });
  }

  /**
   * Send a created (201) response.
   */
  static created(res, { message, data = null }) {
    return ApiResponse.success(res, { statusCode: 201, message, data });
  }

  /**
   * Send an error response.
   * @param {import('express').Response} res
   * @param {object}  options
   * @param {number}  [options.statusCode=500]
   * @param {string}  options.message
   * @param {string}  [options.errorCode]
   * @param {Array}   [options.details]
   */
  static error(res, { statusCode = 500, message, errorCode = null, details = null }) {
    return res.status(statusCode).json({
      success: false,
      message,
      data: null,
      error: {
        code: errorCode,
        ...(details && { details }),
      },
    });
  }
}

module.exports = ApiResponse;
