SELECT
  domain,
  COUNT(0) AS totalOccurrences
FROM (
  SELECT
    page,
    NET.HOST(url) AS domain,
    COUNT(0) AS totalOccurrences
  FROM
    `httparchive.requests.2022_09_01_mobile`
  where  NET.HOST(page) != NET.HOST(url) 
  GROUP BY
    page,
    domain
  UNION ALL 
  SELECT
    page,
    NET.HOST(url) AS domain,
    COUNT(0) AS totalOccurrences 
  from  `httparchive.requests.2022_09_01_desktop`
  where  NET.HOST(page) != NET.HOST(url) 
  GROUP BY
    page,
    domain
)
GROUP BY
  domain
HAVING
  totalOccurrences >= 50
ORDER BY
  totalOccurrences DESC
