# planner/models.py


from django.db import models	


class Viagem(models.Model):

    nome = models.CharField(max_length=200, help_text="O nome ou título da viagem.")
    destino = models.CharField(max_length=200)
    data_inicio = models.DateField()
    data_fim = models.DateField()


def __str__(self):

    return f"{self.nome} - {self.destino}"
