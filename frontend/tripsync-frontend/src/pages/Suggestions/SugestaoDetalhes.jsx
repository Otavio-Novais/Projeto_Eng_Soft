import { useParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth";
import { useEffect, useState } from "react";
import axios from "axios";

export default function SugestaoDetalhes() {
    const { token, user } = useAuthStore();
    const { tripId, sugestaoId } = useParams();
    const [sugestao, setSugestao] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`/viagem/${tripId}/sugestoes/${sugestaoId}/`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => setSugestao(res.data))
        .catch(err => console.log(err));
    }, [tripId, sugestaoId]);

    if (!sugestao) return <>Carregando detalhes...</>;

    const deletar = async () => {
        try {
            await axios.delete(`/viagem/${tripId}/sugestoes/${sugestaoId}/`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            navigate(-1); // volta para a tela anterior
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold">{sugestao.titulo}</h1>
            <p className="mt-2">{sugestao.descricao}</p>

            <p className="mt-4">
                <b>Tipo:</b> {sugestao.tipo}
            </p>

            <p className="mt-1">
                <b>Status:</b> {sugestao.status}
            </p>

            <p className="mt-1">
                <b>Autor:</b> {sugestao.autor_nome}
            </p>

            {/* Mostra o botão APENAS se o usuário for o autor */}
            {user?.id === sugestao.autor && (
                <button
                    onClick={deletar}
                    className="mt-6 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                >
                    Apagar Sugestão
                </button>
            )}
        </div>
    );
}
