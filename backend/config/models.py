from django.db import models

class AppState(models.Model):
    key = models.CharField(max_length=100, unique=True)
    is_ready = models.BooleanField(default=False)

    class Meta:
        verbose_name = 'Application State'
    
    @classmethod
    def get_ready_status(cls):
        state, _ = cls.objects.get_or_create(key='ready', defaults={'is_ready': False})
        print("checking status")
        if not state.is_ready:
            # Only do the expensive check if we haven't marked it ready yet
            AppState.check_status(state)

        return state.is_ready

    @classmethod
    def check_status(cls, state):
        from django.db import connections
        from django.db.migrations.executor import MigrationExecutor
        from django.db.utils import OperationalError, ProgrammingError

        try:
            connection = connections['default']
            executor = MigrationExecutor(connection)
            plan = executor.migration_plan(executor.loader.graph.leaf_nodes())

            if not plan:
                # All migrations applied — update and return
                state.is_ready = True
                state.save()
                return True
        except (OperationalError, ProgrammingError):
            # Probably during first startup or before DB is ready
            pass

        return False