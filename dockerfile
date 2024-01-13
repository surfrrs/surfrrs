FROM python:3.12.0
WORKDIR /Users/dalevu/python_automation
COPY . .
RUN pip install --upgrade pip
# Install Python packages
RUN pip install selenium
RUN pip install -r requirements.txt
CMD python3 -m app
