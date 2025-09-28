    Developer - Nay Oo Kyaw
    Email - nayookyaw.nok@gmail.com

# Google Map with Contents Reactjs and NodeJs Typescript Jest Unit Testing
* Project Details
    This project is the dashboard that end-user is able to manage the location on google map
    Able to manage (add/edit/delete) users
    Able to add new location on the map by clicking on specific location on the map
    Able to manage location details such as name, description, image, start/end datetime and active status

# Result Outcome Dashboard Console
![Screenshot](./result_img/home.png)
![Screenshot](./result_img/locations.png)
![Screenshot](./result_img/locationedit.png)
![Screenshot](./result_img/users.png)
![Screenshot](./result_img/ads1.png)
![Screenshot](./result_img/ads2.png)
![Screenshot](./result_img/ads3.png)
![Screenshot](./result_img/setting.png)


# 1) Start MySQL
docker compose up -d

# 2) Backend
cd backend-nodejs <br>
cp .env.sample .env           # set DATABASE_URL & GOOGLE_MAPS_API_KEY <br>
npm install <br>
npx prisma validate <br>
npx prisma migrate dev --name init <br>

# ensure DATABASE_URL and (optionally) GOOGLE_MAPS_API_KEY in .env
npx prisma generate <br>
npm run seed <br>
# or to rebuild db + re-seed:
npm run db:reset <br>

npm run dev                   # http://localhost:4000 <br>

# migrate the new columns
npx prisma migrate dev --name name_of_description <br>
npx prisma migrate deploy <br>

npx prisma migrate status <br>


# 3) Frontend
cd frontend-reactjs
cp .env.sample .env           # REACT_APP_API_BASE_URL=http://localhost:4000 <br>
npm install <br>
npm start                     # http://localhost:3000 <br>
