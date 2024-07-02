const queries = {
	CREATE_ARTICLE_QUERY: `
				MATCH (author:Author {authorId: $authorId})
				MERGE (category:Category {name: $category})
				MERGE (ni:NON_INDEXED)
				CREATE (a:Article {
					articleId: $id,
					title: $title,
					content: $content,
					created_at: datetime(),
					updated_at: datetime(),
					ranking: 0
				})
				MERGE (author)-[:WROTE]->(a)
				MERGE (a)-[:HAS_AUTHOR]->(author)
				MERGE (ni)-[:ASSOCIATED_WITH]->(a)
				CREATE (a)-[:BELONGS_TO]->(category)
				CREATE (category)-[:CONTAINS]->(a)
				WITH a, CASE WHEN size($tags) > 0 THEN $tags ELSE [] END AS tags
				FOREACH (tagName IN tags | 
					MERGE (t:Tag {name: tagName}) 
					ON CREATE SET t.created_at = datetime()
					CREATE (a)-[:HAS_TAG]->(t)
					CREATE (t)-[:HAS_ARTICLE]->(a)
				)
				RETURN {
					articleId: a.articleId,
					title: a.title,
					content: a.content,
					category: $category,
					created_at: toString(a.created_at),
					updated_at: toString(a.updated_at)
				} AS article`,
	ADD_COLLABORATOR: `
				MATCH (a:Article {articleId: $articleId})
				MATCH (collabor:Author {authorId: $collaboratorId})
				MERGE (collabor)-[:CONTRIBUTED]->(a)
				MERGE (a)-[:HAS_CONTRIBUTOR]->(collabor)`,
	REMOVE_COLLABORATOR: `
				MATCH (a:Article {articleId: $articleId})
				MATCH (collabor:Author {authorId: $collaboratorId})
				OPTIONAL MATCH (collabor)-[r:CONTRIBUTED]->(a)
				DELETE r`,
	EDIT_MODE: `
				MATCH (a:Article {articleId: $articleId})
				MATCH (author:Author {authorId: $userId})
				WHERE (author)-[:WROTE]->(a) OR (author)-[:CONTRIBUTED]->(a)
				RETURN {
					articleId: a.articleId,
					title: a.title,
					content: a.content,
					created_at: toString(a.created_at),
					updated_at: toString(a.updated_at)
				} AS article`,
	GET_ARTICLES_BY_CATEGORY: `
				MATCH (category:Category {name: $category})
				MATCH (category)-[:CONTAINS]->(a:Article)
				OPTIONAL MATCH (a)-[:HAS_AUTHOR]->(author:Author)
				WITH a, author
				ORDER BY a.created_at DESC
				LIMIT 15
				OPTIONAL MATCH (a)-[:HAS_CONTRIBUTOR]->(collabor:Author)
				WITH a, author, COLLECT(collabor.authorId) AS collaborators
				RETURN {
				articleId: a.articleId,
				title: a.title,
				content: a.content,
				author: author.authorId,
				collaborators: collaborators,
				created_at: toString(a.created_at),
				updated_at: toString(a.updated_at)
				} AS article
				`,
	GET_ARTICLES_BY_TAG: `
				MATCH (tag:Tag {name: $tagName})-[:HAS_ARTICLE]->(a:Article)
				OPTIONAL MATCH (a)-[:HAS_AUTHOR]->(author:Author)
				WITH a, author
				ORDER BY a.ranking DESC
				LIMIT 15
				OPTIONAL MATCH (a)-[:HAS_CONTRIBUTOR]->(collabor:Author)
				WITH a, author, COLLECT(collabor.authorId) AS collaborators
				RETURN {
					articleId: a.articleId,
					title: a.title,
					content: a.content,
					author: author.authorId,
					collaborators: collaborators,
					created_at: toString(a.created_at),
					updated_at: toString(a.updated_at),
					ranking: a.ranking
				} AS article
				`,
	GET_ARTICLES_BY_TAGS_AND_CATEGORY: `
				MATCH (a:Article)
				WHERE ALL(tagName IN $tags WHERE (a)-[:HAS_TAG]->(:Tag {name: tagName}))
				MATCH (category)-[:CONTAINS]->(a:Article)
				MATCH (a)-[:HAS_AUTHOR]->(author:Author)
				OPTIONAL MATCH (a)-[:HAS_CONTRIBUTOR]->(collabor:Author)
				WITH a, author, COLLECT(collabor.authorId) AS collaborators
				RETURN {
					articleId: a.articleId,
					title: a.title,
					content: a.content,
					author: author.authorId,
					collaborators: collaborators,
					created_at: toString(a.created_at),
					updated_at: toString(a.updated_at)
				} AS article
				LIMIT 15`,
	CREATE_RELATION_TO_INDEXED: `
				MATCH (a:Article {articleId: $articleId})
				MATCH (:NON_INDEXED)-[r:ASSOCIATED_WITH]->(a)
				DELETE r
				MERGE (i:INDEXED)
				MERGE (i)-[:ASSOCIATED_WITH]->(a)`,
	GET_NOT_INDEXED_ARTICLES: `
				MATCH (:NON_INDEXED)-[:ASSOCIATED_WITH]->(a:Article)
				MATCH (a)-[:HAS_AUTHOR]->(author:Author)
				OPTIONAL MATCH (a)-[:HAS_CONTRIBUTOR]->(collabor:Author)
				WITH a, author, COLLECT(collabor.name) AS collaborators
				MATCH (a)-[:BELONGS_TO]->(category:Category)
				MATCH (a)-[:HAS_TAG]->(tag:Tag)
				WITH a, author, collaborators, category, COLLECT(tag.name) AS tags
				RETURN {
					articleId: a.articleId,
					title: a.title,
					content: a.content,
					author: author.name,
					collaborators: collaborators,
					category: category.name,
					tags: tags,
					created_at: toString(a.created_at)
				} AS article
				LIMIT 15`,
	CREATE_SIMILAR_ARTICLES: `
				MERGE (a:Article {articleId: $firstArticleId})-[:SIMILAR {score: $score}]->(b:Article {articleId: $secondArticleId})
				MERGE (b)-[:SIMILAR {score: $score}]->(a)`,
	DELETE_ARTICLE: `
				MATCH (a:Article {articleId: $articleId})
				MATCH (a)-[r]-()
				OPTIONAL MATCH ()-[r2]->(a)
				DELETE r, r2, a`,
	FIND_ARTICLE_BY_ID: `
						MATCH (a:Article {articleId: $articleId})
						MATCH (a)-[:HAS_AUTHOR]->(author:Author)
					    OPTIONAL MATCH (a)-[:HAS_CONTRIBUTOR]->(collabor:Author)
						WITH a, author, COLLECT(collabor.authorId) AS collaborators
						MATCH (a)-[:BELONGS_TO]->(category:Category)
						MATCH (a)-[:HAS_TAG]->(tag:Tag)
						WITH a, author, collaborators, category, COLLECT(tag.name) AS tags
						RETURN {
							articleId: a.articleId,
							title: a.title,
							content: a.content,
							author: author.authorId,
							collaborators: collaborators,
							category: category.name,
							tags: tags,
							created_at: toString(a.created_at)
						} AS article
						LIMIT 15`,
	FIND_ARTICLE_BY_AUTHOR_ID: `
						MATCH (author:Author {authorId: $authorId})
						MATCH (author)-[:WROTE]->(a:Article)
						WITH a, author
						ORDER BY a.created_at DESC
						LIMIT 15
						OPTIONAL MATCH (a)-[:HAS_CONTRIBUTOR]->(collabor:Author)
						WITH a, COLLECT(collabor.authorId) AS collaborators
						MATCH (a)-[:BELONGS_TO]->(category:Category)
						MATCH (a)-[:HAS_TAG]->(tag:Tag)
						WITH a, collaborators, category, COLLECT(tag.name) AS tags
						RETURN {
							articleId: a.articleId,
							title: a.title,
							content: a.content,
							collaborators: collaborators,
							category: category.name,
							tags: tags,
							created_at: toString(a.created_at)
						}`,
	UPDATE_RANKING: `
					MATCH (a:Article {articleId: $articleId})
					SET a.ranking = $newRanking, a.updated_at = datetime()
					`,
};

module.exports = queries;
