from bs4 import BeautifulSoup
import requests

url = "https://books.toscrape.com/catalogue/a-light-in-the-attic_1000"
response = requests.get(url)
response.encoding = "utf-8"
soup = BeautifulSoup(response.text, 'lxml')
price = soup.select_one('#content_inner').text
print(price)
