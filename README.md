# Installation
In order to start this project for the first time, you should run
```
npm install
```
To start this project, run
```
npm start
```
To start with nodemon, use
```
npm run dev
```

# How to access the server

## 1. Put the SSH key into a folder:
Put the SSH key (i.e. binar-batch8.pem) into a folder (e.g. /home/kunci/binar-batch8.pem)
Make sure the hard drive is a linux disk, don't put it into another disk like windows disk.

## 2. Modify the key to read-only:
simply write `sudo chmod 400 ` on the terminal, then drag-in the file into the terminal.
Example:

```
sudo chmod 400 '/home/kunci/binar-batch8.pem'
```

## 3. Run SSH on the terminal:
Run ssh on the terminal with the key location and server's ip address:
ssh -i `'path to the ssh key'` ubuntu@`server's IP adress`

e.g:
```
ssh -i '/home/kunci/binar-batch8.pem' ubuntu@3.1.218.225
```

## 4. Clone the Git repository (first time only):
After successfully connected, the username on the terminal will be changed into:
```
ubuntu@ip-172-31-23-45
```
Then, clone the Git repository and put a deploy-token that you can get here ([link](https://docs.gitlab.com/ee/user/project/deploy_tokens/)),

put the username and token with this format:<br>
```
git clone https://**username**:**deploy_token**@gitlab.example.com/tanuki/awesome_project.git
```
e.g:

```
git clone https://prequelhorse:Ykr-DF2NGMykn2PYUg4n@gitlab.example.com/tanuki/awesome_project.git
```
Finally pull and start the app:
for the first time, put -u (upstream), e.g.:
```
git pull -u origin master
```

after that we only need to use git pull without -u origin master:
```
git pull
```

## 5. Start the app:


```
npm install
```

```
npm start
```

------------------------

## Environment variables
This project uses environment variable as follows:
```
MYSQL_PASSWORD=""
MYSQL_DATABASE=""
MYSQL_USER=""
MYSQL_HOST=""
PORT=""
JWT_SECRET=""
```


