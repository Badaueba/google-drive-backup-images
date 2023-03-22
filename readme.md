## BACKUP DRIVE IMAGES

#### using nodejs + puppeteer to scrap google drive img and save source url

#### Before running

```

rename .env-example.txt to .env
change the content with your own data information

drive_base_url=https://drive.google.com/drive/
drive_url={some drive page to get imgs}
user_email={your own email}
user_password={your own password}

```

#### Run

```
yarn install

yarn start

```


##### for linux dependencies

sudo apt install libnss3-dev libgdk-pixbuf2.0-dev libgtk-3-dev libxss-dev
