// API responses
interface NewsAPIResponse {
    status: string;
    totalResults: number;
    articles: NewsAPIArticle[];
}

interface NewsAPIArticle {
    source: {
        id: string | null;
        name: string;
    };
    author?: string;
    title: string;
    description: string;
    url: string;
    urlToImage?: string;
    publishedAt: string;
    content?: string;
}

interface GuardianAPIResponse {
    response: {
        status: string;
        total: number;
        results: GuardianArticle[];
    };
}

interface GuardianArticle {
    webTitle: string;
    webUrl: string;
    webPublicationDate: string;
    sectionName: string;
    fields?: {              // Optional because only exists if show-fields is requested
        bodyText?: string;
        thumbnail?: string;
    };
}

// what gets saved to db
export interface RawArticle {
    title: string;
    content: string;
    sourceUrl: string;
    sourceName: string;
    imageUrl?: string;
    publishedAt: Date;
}

// service class
export class NewsAggregationService {
    private newsApiKey: string;
    private guardianApiKey: string;

    constructor(newsApiKey: string, guardianApiKey: string) {
        // validate api keys
        if (!newsApiKey || !guardianApiKey) {
            throw new Error("Api Key's invalid.")
        }
        this.newsApiKey = newsApiKey
        this.guardianApiKey = guardianApiKey
    }

    async fetchFromNewsApi(query: string): Promise<RawArticle[]> {
        const url = `https://newsapi.org/v2/everything?q=${query}&apiKey=${this.newsApiKey}`;

        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`NewsAPI error: ${response.status} ${response.statusText}`)
            }

            const data: NewsAPIResponse = await response.json();

            const articles: RawArticle[] = data.articles.map((article) => ({
                title: article.title,

                content: article.content || article.description || '',

                sourceUrl: article.url,

                sourceName: article.source.name,

                imageUrl: article.urlToImage,

                publishedAt: new Date(article.publishedAt),
            }));

            return articles;

        } catch (error) {
            console.error('Failed to fetch from NewsAPI:', error)
            throw error
        }
    }

    async fetchFromGuardian(query: string): Promise<RawArticle[]> {
        const url = `https://content.guardianapis.com/search?q=${query}&show-fields=bodyText,thumbnail&api-key=${this.guardianApiKey}`;

        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`GuardianAPI error: ${response.status} ${response.statusText}`);
            }

            const data: GuardianAPIResponse = await response.json();

            const articles: RawArticle[] = data.response.results.map((article) => ({
                title: article.webTitle,
                content: article.fields?.bodyText || '',
                sourceUrl: article.webUrl,
                sourceName: article.sectionName,
                imageUrl: article.fields?.thumbnail,
                publishedAt: new Date(article.webPublicationDate),
            }));

            return articles;

        } catch (error) {
            console.error('Failed to fetch from Guardian:', error);
            throw error;
        }
    }
}