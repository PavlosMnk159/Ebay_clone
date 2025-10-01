from django.db import models
from django.db import connections
from django.db.migrations.executor import MigrationExecutor
from django.db.utils import OperationalError, ProgrammingError

class AppState(models.Model):
    is_ready = models.BooleanField(default=False)

    class Meta:
        verbose_name = 'Application State'
    
    @classmethod
    def get_ready_status(cls):
        # get a state object or create one if it doesnt exist
        state = cls.objects.first()
        if not state:
            state = cls.objects.create(is_ready=False)
        # if the state is marked not ready check that all migrations have been completed
        if not state.is_ready:
            cls.check_migrations(state)

        return state.is_ready

    @classmethod
    def check_migrations(cls, state):
        """
        checks that all migrations have been completed
        """

        try:
            # get the plan for the migrations not yet executed
            connection = connections['default']
            executor = MigrationExecutor(connection)
            plan = executor.migration_plan(executor.loader.graph.leaf_nodes())

            if not plan:
                # All migrations applied — update and return
                state.is_ready = True
                state.save()
                return True
        except (OperationalError, ProgrammingError):
            pass

        return False