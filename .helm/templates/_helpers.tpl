# vi:syntax=yaml
# vi:filetype=yaml
{{/*
Common labels
*/}}
{{- define "microservice.labels" -}}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
{{- with .Values.labels }}
{{ toYaml . }}
{{- end }}
{{- end }}
