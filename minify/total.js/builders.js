"use strict";var UNDEFINED="undefined";var FUNCTION="function";var OBJECT="object";var STRING="string";var NUMBER="number";var BOOLEAN="boolean";var REQUIRED='The field "@" is required.';var DEFAULT_SCHEMA="default";var schemas={};var transforms={pagination:{},error:{}};function SchemaBuilder(name){this.name=name;this.collection={}}SchemaBuilder.prototype.get=function(name){return this.collection[name]};SchemaBuilder.prototype.add=function(name,obj,properties,validator){var self=this;if(typeof obj===UNDEFINED)obj={};var keys=Object.keys(obj);if(!properties)properties=keys;self.collection[name]=new SchemaBuilderEntity(self,name,{},validator,properties);for(var i=0,length=keys.length;i<length;i++){var key=keys[i];self.collection[name].define(key,obj[key])}return self.collection[name]};SchemaBuilder.prototype.create=function(){var self=this;return self.add.apply(self,arguments)};SchemaBuilder.prototype.Create=function(){var self=this;return self.add.apply(self,arguments)};SchemaBuilder.prototype.remove=function(name){var self=this;if(name===undefined){delete schemas[name];self.collection=null;return}var schema=self.collection[name];if(schema)schema.remove();schema=null;return self};SchemaBuilder.prototype.destroy=function(name){return this.remove(name)};function SchemaBuilderEntity(parent,name,obj,validator,properties){this.parent=parent;this.name=name;this.primary;this.schema=obj;this.properties=properties===undefined?Object.keys(obj):properties;this.resourcePrefix;this.resourceName;this.transforms;this.composes;this.operations;this.rules;this.constants;this.onPrepare;this.onDefault;this.onValidation=validator;this.onSave;this.onGet;this.onRemove;this.onQuery}SchemaBuilderEntity.prototype.define=function(name,type,required,primary){var self=this;if(name instanceof Array){for(var i=0,length=name.length;i<length;i++)self.define(name[i],type,required);return self}if(type instanceof SchemaBuilderEntity)type=type.name;if(primary)self.primary=primary;self.schema[name]=self.$parse(name,type,required);if(!required)return self;if(self.properties===undefined||self.properties===null)self.properties=[];if(self.properties.indexOf(name)!==-1)return self;self.properties.push(name);return self};SchemaBuilderEntity.prototype.$parse=function(name,value,required){var self=this;var type=typeof value;var result={};result.raw=value;result.type=0;result.length=0;result.required=required;result.isArray=false;if(value===null)return result;if(value==="[]"){result.isArray=true;return result}if(type===FUNCTION){if(value===Number){result.type=2;return result}if(value===String){result.type=3;return result}if(value===Boolean){result.type=4;return result}if(value===Date){result.type=5;return result}if(value===Array){result.isArray=true;return result}if(value===Object){result.type=6;return result}return result}if(type===OBJECT){return result}if(value[0]==="["){value=value.substring(1,value.length-1);result.isArray=true;result.raw=value}var lower=value.toLowerCase();if(lower==="object"){result.type=6;return result}if(lower==="array"){result.isArray=true;return result}if(lower.contains([STRING,"text","varchar","nvarchar"])){result.type=3;var beg=lower.indexOf("(");if(beg===-1)return result;var size=lower.substring(beg+1,lower.length-1).parseInt();result.length=size;result.raw=lower.substring(0,beg);return result}if(lower.contains(["int","byte"])){result.type=1;return result}if(lower.contains(["decimal",NUMBER,"float","double"])){result.type=2;return result}if(lower.contains("bool",BOOLEAN)){result.type=4;return result}if(lower.contains(["date","time"])){result.type=5;return result}result.type=7;return result};SchemaBuilderEntity.prototype.getDependencies=function(){var self=this;var arr=Object.keys(self.schema);var dependencies=[];for(var i=0,length=arr.length;i<length;i++){var name=arr[i];var type=self.schema[name];if(typeof type!==STRING)continue;var isArray=type[0]==="]";if(isArray)type=type.substring(1,type.length-1);var m=self.parent.get(type);if(typeof m===undefined)continue;dependencies.push({name:name,isArray:isArray,schema:m})}return dependencies};SchemaBuilderEntity.prototype.setValidation=function(properties,fn){var self=this;if(fn===undefined&&properties instanceof Array){self.properties=properties;return self}if(typeof properties!==FUNCTION){self.properties=properties;self.onValidation=fn}else self.onValidation=properties;return self};SchemaBuilderEntity.prototype.setPrefix=function(prefix){this.resourcePrefix=prefix;return this};SchemaBuilderEntity.prototype.setResource=function(name){this.resourceName=name;return this};SchemaBuilderEntity.prototype.setDefault=function(fn){var self=this;self.onDefault=fn;return self};SchemaBuilderEntity.prototype.setPrepare=function(fn){var self=this;self.onPrepare=fn;return self};SchemaBuilderEntity.prototype.setSave=function(fn){var self=this;self.onSave=fn;return self};SchemaBuilderEntity.prototype.setGet=function(fn){var self=this;self.onGet=fn;return self};SchemaBuilderEntity.prototype.setQuery=function(fn){var self=this;self.onQuery=fn;return self};SchemaBuilderEntity.prototype.setRemove=function(fn){var self=this;self.onRemove=fn;return self};SchemaBuilderEntity.prototype.setProperties=function(properties){var self=this;self.properties=properties;return self};SchemaBuilderEntity.prototype.addRule=function(name,value){var self=this;if(value===undefined){value=name;name="default"}if(!self.rules)self.rules={};self.rules[name]=value;return self};SchemaBuilderEntity.prototype.constant=function(name,value){var self=this;if(value===undefined)return self.constants?self.constants[name]:undefined;if(!self.constants)self.constants={};self.constants[name]=value;return self};SchemaBuilderEntity.prototype.addTransform=function(name,fn){var self=this;if(typeof name===FUNCTION){fn=name;name="default"}if(!self.transforms)self.transforms={};self.transforms[name]=fn;return self};SchemaBuilderEntity.prototype.addOperation=function(name,fn){var self=this;if(typeof name===FUNCTION){fn=name;name="default"}if(!self.operations)self.operations={};self.operations[name]=fn;return self};SchemaBuilderEntity.prototype.addWorkflow=function(name,fn){var self=this;if(typeof name===FUNCTION){fn=name;name="default"}if(!self.workflows)self.workflows={};self.workflows[name]=fn;return self};SchemaBuilderEntity.prototype.addCompose=function(name,fn){var self=this;if(typeof name===FUNCTION){fn=name;name="default"}if(!self.composes)self.composes={};self.composes[name]=fn;return self};SchemaBuilderEntity.prototype.addComposer=function(name,fn){return this.addCompose(name,fn)};SchemaBuilderEntity.prototype.find=function(name){return this.parent.get(name)};SchemaBuilderEntity.prototype.rule=function(name,value){var self=this;if(value)return self.addRule(name,value);if(self.rules===undefined)return undefined;if(name===undefined)name="default";return self.rules[name]};SchemaBuilderEntity.prototype.destroy=function(){var self=this;delete self.parent.collection[self.name];self.properties=null;self.schema=null;self.onDefault=null;self.onValidation=null;self.onSave=null;self.onRead=null;self.onRemove=null;self.onQuery=null;self.workflows=null;self.transforms=null};SchemaBuilderEntity.prototype.save=function(model,helper,callback){if(callback===undefined){callback=helper;helper=undefined}var self=this;self.$prepare(model,function(err,model){if(err){callback(err,model);return}var builder=new ErrorBuilder;self.onSave(builder,model,helper,function(result){if(arguments.length===2||(result instanceof Error||result instanceof ErrorBuilder)){if(result instanceof Error||result instanceof ErrorBuilder)builder.push(result);result=arguments[1]}callback(builder.hasError()?builder:null,result===undefined?model:result)})});return self};SchemaBuilderEntity.prototype.get=function(helper,callback){if(callback===undefined){callback=helper;helper=undefined}var self=this;var builder=new ErrorBuilder;var output=self.default();self.onGet(builder,output,helper,function(result){if(arguments.length===2||(result instanceof Error||result instanceof ErrorBuilder)){if(result instanceof Error||result instanceof ErrorBuilder)builder.push(result);result=arguments[1]}callback(builder.hasError()?builder:null,result===undefined?output:result)});return self};SchemaBuilderEntity.prototype.remove=function(helper,callback){if(callback===undefined){callback=helper;helper=undefined}var self=this;var builder=new ErrorBuilder;self.onRemove(builder,helper,function(result){if(arguments.length===2||(result instanceof Error||result instanceof ErrorBuilder)){if(result instanceof Error||result instanceof ErrorBuilder)builder.push(result);result=arguments[1]}callback(builder.hasError()?builder:null,result===undefined?helper:result)});return self};SchemaBuilderEntity.prototype.query=function(helper,callback){if(callback===undefined){callback=helper;helper=undefined}var self=this;var builder=new ErrorBuilder;self.onQuery(builder,helper,function(result){if(arguments.length===2||(result instanceof Error||result instanceof ErrorBuilder)){if(result instanceof Error||result instanceof ErrorBuilder)builder.push(result);result=arguments[1]}callback(builder.hasError()?builder:null,result)});return self};SchemaBuilderEntity.prototype.validate=function(model,resourcePrefix,resourceName,builder){var self=this;var fn=self.onValidation;if(builder===undefined)builder=new ErrorBuilder;if(fn===undefined||fn===null){fn=framework.onValidation;if(fn===undefined||fn===null)return builder}if(self.resourcePrefix)builder.resourcePrefix=self.resourcePrefix;if(self.resourceName)builder.resourceName=self.resourceName;if(resourceName)builder.resourceName=resourceName;if(resourcePrefix)builder.resourcePrefix=resourcePrefix;return framework_utils.validate_builder.call(self,model,builder,self.name,self.parent.collection,self.name)};SchemaBuilderEntity.prototype.create=function(){return this.default()};SchemaBuilderEntity.prototype.Create=function(){return this.default()};SchemaBuilderEntity.prototype.$make=function(obj){if(obj.$save)return obj;var self=this;obj.$async=function(callback,index){if(callback===undefined)callback=NOOP;obj.$$async=[];obj.$$result=[];obj.$callback=callback;setImmediate(function(){obj.$$async.async(function(){var result=obj.$$result;delete obj.$$result;delete obj.$$async;callback(null,index!==undefined?result[index]:result)})});return obj};obj.$save=function(helper,callback){if(!obj.$$async){self.save(obj,helper,callback);return obj}obj.$$async.push(function(next){self.save(obj,helper,function(err,result){if(obj.$$result)obj.$$result.push(err?null:result);if(!err)return next();next=null;var result=obj.$$result;delete obj.$$result;delete obj.$$async;obj.$callback(err,result)})});return obj};obj.$remove=function(helper,callback){if(!obj.$$async){self.remove(helper,callback);return obj}obj.$$async.push(function(next){self.remove(obj,helper,function(err,result){if(obj.$$result)obj.$$result.push(err?null:result);if(!err)return next();next=null;var result=obj.$$result;delete obj.$$result;delete obj.$$async;obj.$callback(err,result)})});return obj};obj.$default=function(){return self.default()};obj.$destroy=function(){obj=null};obj.$transform=function(name,helper,callback){if(!obj.$$async){self.transform(name,obj,helper,callback);return obj}obj.$$async.push(function(next){self.transform(name,obj,helper,function(err,result){if(obj.$$result)obj.$$result.push(err?null:result);if(!err)return next();next=null;var result=obj.$$result;delete obj.$$result;delete obj.$$async;obj.$callback(err,result)})});return obj};obj.$compose=function(name,helper,callback){if(!obj.$$async){self.compose(name,obj,helper,callback);return obj}obj.$$async.push(function(next){self.compose(name,obj,helper,function(err,result){if(obj.$$result)obj.$$result.push(err?null:result);if(!err)return next();next=null;var result=obj.$$result;delete obj.$$result;delete obj.$$async;obj.$callback(err,result)})});return obj};obj.$workflow=function(name,helper,callback){if(!obj.$$async){self.workflow(name,obj,helper,callback);return obj}obj.$$async.push(function(next){self.workflow(name,obj,helper,function(err,result){if(obj.$$result)obj.$$result.push(err?null:result);if(!err)return next();next=null;var result=obj.$$result;delete obj.$$result;delete obj.$$async;obj.$callback(err,result)})});return obj};obj.$operation=function(name,helper,callback){if(!obj.$$async){self.operation(name,obj,helper,callback);return obj}obj.$$async.push(function(next){self.operation(name,obj,helper,function(err,result){if(obj.$$result)obj.$$result.push(err?null:result);if(!err)return next();next=null;var result=obj.$$result;delete obj.$$result;delete obj.$$async;obj.$callback(err,result)})});return obj};obj.$clean=function(){return self.clean(obj)};obj.$clone=function(){return self.$make(JSON.parse(JSON.stringify(obj)))};obj.$prepare=function(){return self.prepare(obj)};obj.$schema=function(){return self};obj.$validate=function(resourcePrefix,resourceName,builder){return self.validate(obj,resourcePrefix,resourceName,builder)};obj.$rule=function(name){return self.rule(name)};obj.$constant=function(name){return self.constant(name)};return obj};SchemaBuilderEntity.prototype.$prepare=function(obj,callback){var self=this;if(typeof obj.$save===FUNCTION){callback(null,obj);return self}self.make(obj,function(err,model){callback(err,model)});return self};SchemaBuilderEntity.prototype.default=function(){var self=this;var obj=self.schema;if(obj===null)return null;var defaults=self.onDefault;var item=framework_utils.extend({},obj,true);var properties=Object.keys(item);for(var i=0,length=properties.length;i<length;i++){var property=properties[i];var type=item[property];if(defaults){var def=defaults(property,true,self.name);if(def!==undefined){item[property]=def;continue}}switch(type.type){case 0:case 6:item[property]=type.isArray?[]:null;break;case 1:case 2:item[property]=type.isArray?[]:0;break;case 3:item[property]=type.isArray?[]:"";break;case 4:item[property]=type.isArray?[]:false;break;case 5:item[property]=type.isArray?[]:new Date;break;case 7:if(type.isArray){item[property]=[]}else{var tmp=self.find(type.raw);if(!tmp){framework.error(new Error('Schema: "'+property+"."+type.raw+'" not found in "'+self.parent.name+'".'));item[property]=null}else item[property]=tmp.default()}break}}return self.$make(item)};SchemaBuilderEntity.prototype.make=SchemaBuilderEntity.prototype.load=function(model,callback){var self=this;var output=self.prepare(model);if(self.onValidation===undefined){if(callback)callback(null,output);return output}var builder=self.validate(output);if(builder.hasError()){if(callback)callback(builder,null);return output}if(callback)callback(null,output);return output};SchemaBuilderEntity.prototype.prepare=function(model,dependencies){var self=this;var obj=self.schema;if(obj===null)return null;if(model===null||model===undefined)return self.default();var onPrepare=function(name,value,index){if(!self.onPrepare)return value;var val=self.onPrepare(name,value,index);return val===undefined?value:val};var tmp;var entity;var item=framework_utils.extend({},obj,true);var properties=Object.keys(item);var defaults=self.onDefault;for(var i=0,length=properties.length;i<length;i++){var property=properties[i];var val=model[property];if(!model.hasOwnProperty(property))val=undefined;if(val===undefined&&defaults)val=defaults(property,false,self.name);if(val===undefined)val="";var type=item[property];var typeval=typeof val;if(typeval===FUNCTION)val=val();if(!type.isArray){switch(type.type){case 0:break;case 1:item[property]=onPrepare(property,framework_utils.parseInt(val));break;case 2:item[property]=onPrepare(property,framework_utils.parseFloat(val));break;case 3:tmp=val===undefined||val===null?"":val.toString().trim();if(type.length>0&&type.length<tmp.length)tmp=tmp.substring(0,type.length);item[property]=onPrepare(property,tmp);break;case 4:tmp=val.toString().toLowerCase();item[property]=onPrepare(property,tmp==="true"||tmp==="1"||tmp==="on");break;case 5:tmp=null;if(typeval===STRING){if(val==="")tmp=null;else tmp=val.trim().parseDate()}else if(typeval===OBJECT){if(framework_utils.isDate(val))tmp=val;else tmp=null}else if(typeval===NUMBER){tmp=new Date(val)}if(tmp!==null&&typeof tmp===OBJECT&&tmp.toString()==="Invalid Date")tmp=null;if(tmp)item[property]=onPrepare(property,tmp);else item[property]=defaults?isUndefined(defaults(property,false,self.name),null):null;break;case 6:item[property]=onPrepare(property,model[property]);break;case 7:entity=self.parent.get(type.raw);if(entity){item[property]=entity.prepare(val);if(dependencies)dependencies.push({name:type.raw,value:onPrepare(property,item[property])})}else item[property]=null;break}continue}if(!(val instanceof Array)){item[property]=defaults?isUndefined(defaults(property,false,self.name),[]):[];continue}item[property]=[];for(var j=0,sublength=val.length;j<sublength;j++){tmp=model[property][j];typeval=typeof tmp;switch(type.type){case 0:tmp=onPrepare(property,tmp,j);break;case 1:tmp=onPrepare(property,framework_utils.parseInt(tmp),j);break;case 2:tmp=onPrepare(property,framework_utils.parseFloat(tmp),j);break;case 3:tmp=tmp===undefined||tmp===null?"":tmp.toString().trim();if(type.length>0&&tmp.length<tmp.length)tmp=tmp.substring(0,type.length);tmp=onPrepare(property,tmp,j);break;case 4:if(tmp)tmp=tmp.toString().toLowerCase();tmp=onPrepare(property,tmp==="true"||tmp==="1"||tmp==="on",j);break;case 5:if(typeval===STRING){if(tmp==="")tmp=null;else tmp=tmp.trim().parseDate()}else if(typeval===OBJECT){if(framework_utils.isDate(tmp))tmp=tmp;else tmp=null}else if(typeval===NUMBER){tmp=new Date(tmp)}if(tmp!==null&&typeof tmp===OBJECT&&tmp.toString()==="Invalid Date")tmp=null;if(tmp)tmp=onPrepare(property,tmp,j);else tmp=undefined;break;case 6:tmp=onPrepare(property,tmp,j);break;case 7:entity=self.parent.get(type.raw);if(entity){tmp=entity.prepare(tmp,dependencies);if(dependencies)dependencies.push({name:type.raw,value:onPrepare(property,tmp,j)})}else tmp=null;tmp=onPrepare(property,tmp,j);break}if(tmp===undefined)continue;item[property].push(tmp)}}return self.$make(item)};SchemaBuilderEntity.prototype.transform=function(name,model,helper,callback){var self=this;if(typeof name!==STRING){callback=helper;helper=model;model=name;name="default"}if(callback===undefined){callback=helper;helper=undefined}if(typeof callback!=="function")callback=NOOP;var trans=self.transforms?self.transforms[name]:undefined;if(!trans){callback((new ErrorBuilder).add("","Transform not found."));return}self.$prepare(model,function(err,model){if(err){callback(err,model);return}var builder=new ErrorBuilder;trans.call(self,builder,model,helper,function(result){if(!callback)return;if(arguments.length===2||(result instanceof Error||result instanceof ErrorBuilder)){if(result instanceof Error||result instanceof ErrorBuilder)builder.push(result);result=arguments[1]}callback(builder.hasError()?builder:null,result===undefined?model:result,model)},self.name)});return self};SchemaBuilderEntity.prototype.compose=function(name,model,helper,callback){var self=this;if(typeof name!==STRING){callback=helper;helper=model;model=name;name="default"}if(callback===undefined){callback=helper;helper=undefined}if(typeof callback!=="function")callback=NOOP;var compose=self.composes?self.composes[name]:undefined;if(!compose){callback((new ErrorBuilder).add("","Composer not found."));return}self.$prepare(model,function(err,model){if(err){callback(err,model);return}var output=self.default();var builder=new ErrorBuilder;compose.call(self,builder,output,model,helper,function(result){if(!callback)return;if(arguments.length===2||(result instanceof Error||result instanceof ErrorBuilder)){if(result instanceof Error||result instanceof ErrorBuilder)builder.push(result);result=arguments[1]}callback(builder.hasError()?builder:null,result===undefined?model:result,model)},self.name)});return self};SchemaBuilderEntity.prototype.workflow=function(name,model,helper,callback){var self=this;if(typeof name!==STRING){callback=helper;helper=model;model=name;name="default"}if(callback===undefined){callback=helper;helper=undefined}if(typeof callback!=="function")callback=NOOP;var workflow=self.workflows?self.workflows[name]:undefined;if(!workflow){callback((new ErrorBuilder).add("","Workflow not found."));return}self.$prepare(model,function(err,model){if(err){callback(err,model);return}var builder=new ErrorBuilder;workflow.call(self,builder,model,helper,function(result){if(!callback)return;if(arguments.length===2||(result instanceof Error||result instanceof ErrorBuilder)){if(result instanceof Error||result instanceof ErrorBuilder)builder.push(result);result=arguments[1]}callback(builder.hasError()?builder:null,result===undefined?model:result,model)},self.name)});return self};SchemaBuilderEntity.prototype.operation=function(name,model,helper,callback){var self=this;var tm=typeof model;var th=typeof helper;var tc=typeof callback;if(tc===UNDEFINED){if(th===FUNCTION){callback=helper;helper=model;model=undefined}else if(th===UNDEFINED){helper=model;model=undefined}}else if(th===UNDEFINED){helper=model;model=undefined}if(typeof helper===FUNCTION){callback=helper;helper=undefined}if(typeof callback!=="function")callback=NOOP;var operation=self.operations?self.operations[name]:undefined;if(!operation){callback((new ErrorBuilder).add("","Operation not found."));return}var builder=new ErrorBuilder;operation.call(self,builder,model,helper,function(result){if(!callback)return;if(arguments.length===2||(result instanceof Error||result instanceof ErrorBuilder)){if(result instanceof Error||result instanceof ErrorBuilder)builder.push(result);result=arguments[1]}callback(builder.hasError()?builder:null,result)},self.name);return self};SchemaBuilderEntity.prototype.clean=function(m,isCopied){if(m===null||m===undefined)return m;var model;if(!isCopied)model=framework_utils.copy(m);else model=m;var self=this;delete model["$$result"];delete model["$$async"];delete model["$clone"];delete model["$async"];delete model["$callback"];delete model["$transform"];delete model["$workflow"];delete model["$operation"];delete model["$destroy"];delete model["$save"];delete model["$remove"];delete model["$clean"];delete model["$prepare"];delete model["$default"];delete model["$schema"];delete model["$validate"];delete model["$compose"];delete model["$rule"];delete model["$constant"];var keys=Object.keys(model);for(var i=0,length=keys.length;i<length;i++){var key=keys[i];var value=model[key];if(value===null)continue;if(typeof value!==OBJECT)continue;if(value instanceof Array){for(var j=0,sublength=value.length;j<sublength;j++){var item=value[j];if(item===null)continue;if(typeof item!==OBJECT)continue;value[j]=self.clean(item,true)}continue}model[key]=self.clean(value,true)}return model};function ErrorBuilder(onResource){this.items=[];this.transformName=transforms["error_default"];this.onResource=onResource;this.resourceName=framework.config["default-errorbuilder-resource-name"]||"default";this.resourcePrefix=framework.config["default-errorbuilder-resource-prefix"]||"";this.isResourceCustom=false;this.count=0;this.replacer=[];this.isPrepared=false;if(onResource===undefined)this._resource()}function UrlBuilder(){this.builder={}}function Pagination(items,page,max,format){this.isNext=false;this.isPrev=false;this.isFirst=false;this.isLast=false;this.items=items;this.count=0;this.skip=0;this.take=0;this.page=0;this.max=0;this.visible=false;this.format=format||"?page={0}";this.refresh(items,page,max);this.transformName=transforms["pagination_default"]}exports.schema=function(name,obj,defaults,validator,properties){if(obj===undefined){if(schemas[name]===undefined)schemas[name]=new SchemaBuilder(name);return schemas[name]}if(schemas[DEFAULT_SCHEMA]===undefined)schemas[DEFAULT_SCHEMA]=new SchemaBuilder(DEFAULT_SCHEMA);if(typeof defaults!==FUNCTION)defaults=undefined;if(typeof validator!==FUNCTION)validator=undefined;if(!(properties instanceof Array))properties=undefined;var schema=schemas[DEFAULT_SCHEMA].add(name,obj,properties,validator);if(defaults)schema.setDefault(defaults);return obj};exports.load=function(group,name,model){if(!group)group=DEFAULT_SCHEMA;if(schemas[group]===undefined)schemas[group]=new SchemaBuilder(group);var schema;if(name){schema=schemas[group].get(name);if(!schema)throw new Error("Schema "+group+"."+name+" not found.")}return model?schema.make(model):name?schema:schemas[group]};exports.getschema=function(group,name){if(!name){name=group;group=DEFAULT_SCHEMA}var g=schemas[group];if(g===undefined)throw new Error("Schema "+group+"/"+name+" not found.");var s=g.get(name);if(!s)throw new Error("Schema "+group+"/"+name+" not found.");return s};exports.newschema=function(group,name,model){if(!group)group=DEFAULT_SCHEMA;if(schemas[group]===undefined)schemas[group]=new SchemaBuilder(group);var schema;if(name){schema=schemas[group].get(name);if(!schema)schema=schemas[group].create(name)}return model?schema.make(model):name?schema:schemas[group]};exports.remove=function(name){delete schemas[name]};exports.isJoin=function(collection,value){if(!value)return false;if(value[0]==="[")return true;if(collection===undefined)return false;return collection[value]!==undefined};exports.validation=function(name,properties,fn){if(schemas[DEFAULT_SCHEMA]===undefined)return[];var schema=schemas[DEFAULT_SCHEMA].get(name);if(schema===undefined)return[];if(fn instanceof Array&&typeof properties===FUNCTION){var tmp=fn;fn=properties;properties=fn}if(typeof fn===FUNCTION){schema.onValidation=fn;if(properties===undefined)schema.properties=Object.keys(schema.schema);else schema.properties=properties;return true}if(fn===undefined){var validator=schema.properties;if(validator===undefined)return Object.keys(schema.schema);return validator||[]}schema.onValidation=fn;return fn};exports.validate=function(name,model,resourcePrefix,resourceName){var schema=schemas[DEFAULT_SCHEMA];if(schema===undefined)return null;schema=schema.get(name);if(schema===undefined)return null;var fn=schema.onValidation;return schema.validate(model,resourcePrefix,resourceName)};exports.create=function(name){return exports.defaults(name)};exports.defaults=function(name){if(schemas[DEFAULT_SCHEMA]===undefined)return null;var schema=schemas[DEFAULT_SCHEMA].get(name);if(schema===undefined)return null;return schema.default()};exports.prepare=function(name,model){if(schemas[DEFAULT_SCHEMA]===undefined)return null;var schema=schemas[DEFAULT_SCHEMA].get(name);if(schema===undefined)return null;return schema.prepare(model)};function isUndefined(value,def){if(value===undefined)return def;return value}ErrorBuilder.prototype={get errors(){var self=this;if(!self.isPrepared)self.prepare();return self._transform()},get error(){var self=this;if(!self.isPrepared)self.prepare();return self._transform()}};ErrorBuilder.prototype.resource=function(name,prefix){var self=this;self.isResourceCustom=true;self.resourceName=name||"default";self.resourcePrefix=prefix||"";return self._resource()};ErrorBuilder.prototype.setResource=function(name){var self=this;self.isResourceCustom=true;self.resourceName=name||"default";return self._resource()};ErrorBuilder.prototype.setPrefix=function(name){var self=this;self.isResourceCustom=true;self.resourcePrefix=name||"";return self._resource()};ErrorBuilder.prototype._resource=function(){var self=this;self.onResource=function(name){var self=this;if(typeof framework!==UNDEFINED)return framework.resource(self.resourceName,self.resourcePrefix+name);return""};return self};ErrorBuilder.prototype.add=function(name,error,path,index){var self=this;self.isPrepared=false;if(name instanceof ErrorBuilder){if(name.hasError()){for(var i=0,length=name.items.length;i<length;i++)self.items.push(name.items[i]);self.count=self.items.length}return self}if(typeof name===OBJECT){path=error;error=name;name=""}if((name===undefined||name===null)&&(error===undefined||error===null))return self;if(error===undefined)error="@";if(error===undefined||error===null)return self;if(error instanceof Error)error=error.toString();self.items.push({name:name,error:typeof error===STRING?error:(error||"").toString()||"@",path:path,index:index});self.count=self.items.length;return self};ErrorBuilder.prototype.push=function(name,error,path,index){return this.add(name,error,path,index)};ErrorBuilder.prototype.remove=function(name){var self=this;self.items=self.items.remove(function(o){return o.name===name});self.count=self.items.length;return self};ErrorBuilder.prototype.hasError=function(name){var self=this;if(name){return self.items.find(function(o){return o.name===name})!==null}return self.items.length>0};ErrorBuilder.prototype.read=function(name){var self=this;if(!self.isPrepared)self.prepare();var error=self.items.find(function(o){return o.name===name});if(error!==null)return error.error;return null};ErrorBuilder.prototype.clear=function(){var self=this;self.items=[];self.count=0;return self};ErrorBuilder.prototype.replace=function(search,newvalue){var self=this;self.isPrepared=false;self.replacer[search]=newvalue;return self};ErrorBuilder.prototype.json=function(beautify,replacer){var obj=this.prepare()._transform();if(beautify)return JSON.stringify(obj,replacer,"	");return JSON.stringify(obj,replacer)};ErrorBuilder.prototype.JSON=function(beautify,replacer){return this.json(beautify,replacer)};ErrorBuilder.prototype.output=function(){return this.prepare()._transform()};ErrorBuilder.prototype._prepare=function(){var self=this;if(self.onResource===null)return self;var errors=self.items;var length=errors.length;for(var i=0;i<length;i++){var o=errors[i];if(o.error[0]!=="@")continue;if(o.error.length===1)o.error=self.onResource(o.name);else o.error=self.onResource(o.error.substring(1));if(o.error===undefined||o.error.length===0)o.error=REQUIRED.replace("@",o.name)}return self};ErrorBuilder.prototype._transform=function(name){var self=this;var transformName=name||self.transformName;if(!transformName)return self.items;var current=transforms["error"][transformName];if(current===undefined)return self.items;return current.call(self)};ErrorBuilder.prototype.toString=function(){var self=this;if(!self.isPrepared)self.prepare();var errors=self.items;var length=errors.length;var builder=[];for(var i=0;i<length;i++)builder.push(errors[i].error||errors[i].name);return builder.join("\n")};ErrorBuilder.prototype.setTransform=function(name){var self=this;self.transformName=name;return self};ErrorBuilder.prototype.transform=function(name){var self=this;return self.prepare()._transform(name)};ErrorBuilder.prototype._prepareReplace=function(){var self=this;var errors=self.items;var lengthBuilder=errors.length;var keys=Object.keys(self.replacer);var lengthKeys=keys.length;if(lengthBuilder===0||lengthKeys===0)return self;for(var i=0;i<lengthBuilder;i++){var o=errors[i];for(var j=0;j<lengthKeys;j++){var key=keys[j];o.error=o.error.replace(key,self.replacer[key])}}return self};ErrorBuilder.prototype.prepare=function(){var self=this;if(self.isPrepared)return self;self._prepare()._prepareReplace();self.isPrepared=true;return self};ErrorBuilder.addTransform=function(name,fn,isDefault){transforms["error"][name]=fn;if(isDefault)ErrorBuilder.setDefaultTransform(name)};ErrorBuilder.removeTransform=function(name){delete transforms["error"][name]};ErrorBuilder.setDefaultTransform=function(name){if(name===undefined)delete transforms["error_default"];else transforms["error_default"]=name};Pagination.addTransform=function(name,fn,isDefault){transforms["pagination"][name]=fn;if(isDefault)Pagination.setDefaultTransform(name)};Pagination.setDefaultTransform=function(name){if(name===undefined)delete transforms["pagination_default"];else transforms["pagination_default"]=name};Pagination.removeTransform=function(name){delete transforms["pagination"][name]};Pagination.prototype.refresh=function(items,page,max){var self=this;self.count=Math.floor(items/max)+(items%max>0?1:0);self.page=page-1;if(self.page<0)self.page=0;self.items=items;self.skip=self.page*max;
self.take=max;self.max=max;self.isPrev=self.page>0;self.isNext=self.page<self.count-1;self.isFirst=self.count>1;self.isLast=self.count>1;self.visible=self.count>1;self.page++;return self};Pagination.prototype.setTransform=function(name){var self=this;self._transform=name;return self};Pagination.prototype.transform=function(name){var self=this;var transformName=name||self.transformName;if(!transformName)throw new Error("A transformation of Pagination not found.");var current=transforms["pagination"][transformName];if(current===undefined)return self.render();var param=[];for(var i=1;i<arguments.length;i++)param.push(arguments[i]);return current.apply(self,param)};Pagination.prototype.prev=function(format){var self=this;var page=0;format=format||self.format;if(self.isPrev)page=self.page-1;else page=self.count;return{url:format.format(page,self.items,self.count),page:page,selected:false,enabled:self.isPrev}};Pagination.prototype.next=function(format){var self=this;var page=0;format=format||self.format;if(self.isNext)page=self.page+1;else page=1;return{url:format.format(page,self.items,self.count),page:page,selected:false,enabled:self.isNext}};Pagination.prototype.last=function(format){var self=this;var page=self.count;if(self.isPrev)page=self.page-1;format=format||self.format;return{url:format.format(page,self.items,self.count),page:page,selected:false,enabled:self.count>0}};Pagination.prototype.first=function(format){var self=this;var page=1;format=format||self.format;return{url:format.format(page,self.items,self.count),page:page,selected:false,enabled:self.count>0}};Pagination.prototype.prepare=function(max,format){var self=this;if(self.transformName)return transforms["pagination"][self.transformName].apply(self,arguments);var builder=[];format=format||self.format;if(typeof max===STRING){var tmp=format;format=max;max=format}if(max===undefined||max===null){for(var i=1;i<self.count+1;i++)builder.push({url:format.format(i,self.items,self.count),page:i,selected:i===self.page,enabled:true});return builder}var half=Math.floor(max/2);var pages=self.count;var pageFrom=self.page-half;var pageTo=self.page+half;var plus=0;if(pageFrom<=0){plus=Math.abs(pageFrom);pageFrom=1;pageTo+=plus}if(pageTo>=pages){pageTo=pages;pageFrom=pages-max}if(pageFrom<0)pageFrom=1;for(var i=pageFrom;i<pageTo+1;i++)builder.push({url:format.format(i,self.items,self.count),page:i,selected:i===self.page,enabled:true});return builder};Pagination.prototype.render=function(max,format){return this.prepare(max,format)};UrlBuilder.prototype.add=function(name,value){var self=this;if(typeof name!==OBJECT){self.builder[name]=value;return self}var arr=Object.keys(name);for(var i=0,length=arr.length;i<length;i++)self.builder[arr[i]]=name[arr[i]];return self};UrlBuilder.prototype.remove=function(name){var self=this;delete self.builder[name];return self};UrlBuilder.prototype.read=function(name){return this.builder[name]||null};UrlBuilder.prototype.clear=function(){var self=this;self.builder={};return self};UrlBuilder.prototype.toString=function(url,skipEmpty){if(typeof url===BOOLEAN){var tmp=skipEmpty;skipEmpty=url;url=tmp}var self=this;var builder=[];Object.keys(self.builder).forEach(function(o){var value=self.builder[o];if(value===undefined||value===null)value="";else value=value.toString();if(skipEmpty&&value==="")return;builder.push(o+"="+encodeURIComponent(value))});if(typeof url===STRING){if(url[url.length-1]!=="?")url+="?"}else url="";return url+builder.join("&")};UrlBuilder.prototype.hasValue=function(keys){if(keys===undefined)return false;var self=this;if(typeof keys==="string")keys=[keys];for(var i=0;i<keys.length;i++){var val=self.builder[keys[i]];if(val===undefined||val===null)return false}return true};UrlBuilder.prototype.toOne=function(keys,delimiter){var self=this;var builder=[];keys.forEach(function(o){builder.push(self.builder[o]||"")});return builder.join(delimiter||"&")};exports.SchemaBuilder=SchemaBuilder;exports.ErrorBuilder=ErrorBuilder;exports.Pagination=Pagination;exports.UrlBuilder=UrlBuilder;global.ErrorBuilder=ErrorBuilder;