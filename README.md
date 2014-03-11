BoardMap
---------

![BoardMap](https://f.cloud.github.com/assets/72997/2061916/75b7c09c-8c72-11e3-9602-2089755939e7.png)

Development
--------------------

```
> bundle install --path vendor/bundle
> SHIRASETE_API_KEY='xxxxxxxxxxXXXXXXXxxXXXxxxxxxXX' SHIRASETE_PROJECT_ID=22 bundle exec rackup
```

then, open http://localhost:9292/ with your browser


How to use on heroku?
---------------------

```
> heroku create
> git remote add heroku ${HEROKU GIT REPO}
> git push -u heroku master
```
