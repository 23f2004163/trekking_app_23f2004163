from celery import Celery

from backend.configurations import REDIS_URL



def create_celery():

    celery = Celery(
        "trekdeck",
        broker=REDIS_URL,
        backend=REDIS_URL
    )

    # Import Flask application factory
    from backend import create_app

    flask_app = create_app()


    # Make Flask app context available
    class FlaskTask(celery.Task):

        def __call__(self, *args, **kwargs):

            with flask_app.app_context():

                return self.run(
                    *args,
                    **kwargs
                )


    celery.Task = FlaskTask

    return celery


celery = create_celery()
import backend.tasks