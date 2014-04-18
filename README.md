Voting Station Map
---------

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
> heroku config:set SHIRASETE_API_KEY='xxxxxxxxxxXXXXXXXxxXXXxxxxxxXX' SHIRASETE_PROJECT_ID=22
> git remote add heroku ${HEROKU GIT REPO}
> git push -u heroku master
```

SHIRASETE_PROJECT_IDs
---------------------

* 34 for all

