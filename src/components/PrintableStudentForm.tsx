import React, { forwardRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StudentData {
  id: string;
  nome_completo: string;
  graduacao: string;
  tipo_militar: string;
  local_servico?: string;
  telefone: string | null;
  email: string | null;
  observacoes: string | null;
  foto_url?: string | null;
  data_nascimento?: string | null;
  funcao?: string | null;
  matricula?: number;
  whatsapp?: string | null;
}

interface PrintableStudentFormProps {
  student: StudentData;
}

export const PrintableStudentForm = forwardRef<HTMLDivElement, PrintableStudentFormProps>(
  ({ student }, ref) => {
    return (
      <div ref={ref} className="print-form-content">
        <style>
          {`
            @media print {
              @page {
                size: A4 portrait;
                margin: 15mm;
              }
              
              body * {
                visibility: hidden;
              }
              
              .print-form-content,
              .print-form-content * {
                visibility: visible;
              }
              
              .print-form-content {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                background: white;
                color: black;
              }
              
              .no-print {
                display: none !important;
              }
              
              .print-form-header {
                margin-bottom: 20px;
                text-align: center;
              }
              
              .print-form-title {
                font-size: 24px;
                font-weight: bold;
                color: black;
                margin-bottom: 5px;
              }
              
              .print-form-subtitle {
                font-size: 16px;
                color: #666;
                margin-bottom: 20px;
              }
              
              .student-photo {
                max-width: 120px;
                max-height: 150px;
                object-fit: cover;
                border: 1px solid #ddd;
                border-radius: 4px;
              }
              
              .form-grid {
                display: grid;
                grid-template-columns: auto 1fr;
                gap: 10px 15px;
                margin: 15px 0;
              }
              
              .form-label {
                font-weight: bold;
                color: #333;
              }
              
              .form-value {
                border-bottom: 1px solid #eee;
                padding-bottom: 2px;
              }
            }
            
            @media screen {
              .print-form-content {
                display: none;
              }
            }
          `}
        </style>
        
        <div className="print-form-header">
          <h1 className="print-form-title">FICHA DE CADASTRO DE ALUNO</h1>
          <p className="print-form-subtitle">Formulário de Informações do Aluno</p>
        </div>
        
        <Card className="shadow-none border">
          <CardHeader>
            <CardTitle className="text-xl">Informações do Aluno</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Photo Section */}
              <div className="md:col-span-1 flex justify-center">
                {student.foto_url ? (
                  <img 
                    src={student.foto_url} 
                    alt="Foto do aluno" 
                    className="student-photo max-w-[120px] max-h-[150px] object-cover border rounded"
                  />
                ) : (
                  <div className="w-[120px] h-[150px] bg-gray-100 border-2 border-dashed rounded-md flex items-center justify-center text-gray-500">
                    Sem Foto
                  </div>
                )}
              </div>
              
              {/* Form Fields */}
              <div className="md:col-span-2">
                <div className="form-grid">
                  <div className="form-label">Nome Completo:</div>
                  <div className="form-value">{student.nome_completo || "-"}</div>
                  
                  <div className="form-label">Matrícula:</div>
                  <div className="form-value">{student.matricula || "-"}</div>
                  
                  <div className="form-label">Graduação:</div>
                  <div className="form-value">{student.graduacao || "-"}</div>
                  
                  <div className="form-label">Função:</div>
                  <div className="form-value">{student.funcao || "-"}</div>
                  
                  <div className="form-label">Tipo Militar:</div>
                  <div className="form-value">{student.tipo_militar || "-"}</div>
                  
                  <div className="form-label">Local de Serviço:</div>
                  <div className="form-value">{student.local_servico || "-"}</div>
                  
                  <div className="form-label">Data de Nascimento:</div>
                  <div className="form-value">
                    {student.data_nascimento 
                      ? new Date(student.data_nascimento).toLocaleDateString('pt-BR') 
                      : "-"}
                  </div>
                  
                  <div className="form-label">Telefone:</div>
                  <div className="form-value">{student.telefone || "-"}</div>
                  
                  <div className="form-label">WhatsApp:</div>
                  <div className="form-value">{student.whatsapp || "-"}</div>
                  
                  <div className="form-label">Email:</div>
                  <div className="form-value">{student.email || "-"}</div>
                  
                  <div className="form-label">Observações:</div>
                  <div className="form-value">{student.observacoes || "-"}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
);

PrintableStudentForm.displayName = "PrintableStudentForm";