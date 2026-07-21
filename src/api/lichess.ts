import axios from 'axios'
import type { AxiosInstance } from 'axios'
import type { GamesQueryParams, LichessGame, LichessUser } from '@/types/lichess'

const BASE_URL = 'https://lichess.org'
const DEFAULT_TIMEOUT = 30_000

export class LichessApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
  ) {
    super(message)
    this.name = 'LichessApiError'
  }
}

export class LichessApiClient {
  private readonly http: AxiosInstance

  constructor(baseUrl: string = BASE_URL) {
    this.http = axios.create({
      baseURL: baseUrl,
      timeout: DEFAULT_TIMEOUT,
      headers: {
        Accept: 'application/json',
      },
    })
  }

  async getUser(username: string): Promise<LichessUser> {
    try {
      const response = await this.http.get<LichessUser>(`/api/user/${encodeURIComponent(username)}`)
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new LichessApiError(`User "${username}" not found`, 404)
        }
        throw new LichessApiError(
          error.response?.statusText ?? error.message,
          error.response?.status,
        )
      }
      throw new LichessApiError('Failed to fetch user data')
    }
  }

  async getUserGames(username: string, params: GamesQueryParams = {}): Promise<LichessGame[]> {
    try {
      const response = await this.http.get<string>(
        `/api/games/user/${encodeURIComponent(username)}`,
        {
          params: {
            ...params,
            pgnInJson: true,
            opening: true,
            moves: false,
            clocks: false,
          },
          headers: {
            Accept: 'application/x-ndjson',
          },
          responseType: 'text',
        },
      )
      return this.parseNdJson<LichessGame>(response.data)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new LichessApiError(`User "${username}" not found`, 404)
        }
        throw new LichessApiError(
          error.response?.statusText ?? error.message,
          error.response?.status,
        )
      }
      throw new LichessApiError('Failed to fetch games')
    }
  }

  private parseNdJson<T>(text: string): T[] {
    if (text.trim() === '') {
      return []
    }
    return text
      .trim()
      .split('\n')
      .filter((line) => line.trim() !== '')
      .map((line) => JSON.parse(line) as T)
  }
}

export const lichessApi = new LichessApiClient()
